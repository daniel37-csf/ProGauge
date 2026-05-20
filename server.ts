import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

// Simple in-memory store for OTPs (In production, use Redis or Firestore)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

let resendClient: Resend | null = null;
function getResendClient() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is not configured. OTP emails will not be sent.");
      return null;
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OTP Verification Routes
  app.post("/api/auth/otp/send", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { code, expiresAt });

    const resend = getResendClient();
    if (!resend) {
      // Fallback for preview mode if no key is present
      return res.json({ 
        success: true, 
        message: "Debug Mode: RESEND_API_KEY missing. Code generated.",
        debugCode: code 
      });
    }

    try {
      console.log(`[Resend] Attempting to send OTP to: ${email}`);
      const data = await resend.emails.send({
        from: "Sentinel <onboarding@resend.dev>",
        to: email,
        subject: "Security Handshake: Verification Code",
        html: `
          <div style="font-family: sans-serif; background: #0b0b0b; color: #ffffff; padding: 40px; border: 1px solid #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #F0FF42; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Identity Verification</h2>
            <p style="color: #888; font-size: 14px; line-height: 1.6;">A security handshake has been initialized for your account. Use the code below to access the credential vault.</p>
            <div style="font-size: 42px; font-weight: bold; letter-spacing: 12px; margin: 40px 0; border-left: 4px solid #F0FF42; padding-left: 24px; color: #F0FF42;">${code}</div>
            <p style="font-size: 11px; color: #444; border-top: 1px solid #222; pt: 20px;">This code expires in 10 minutes. If you did not request this, please secure your communication nodes.</p>
          </div>
        `,
      });
      console.log(`[Resend] Successfully dispatched signal. ID: ${data.data?.id}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Resend Error:", error);
      res.status(500).json({ error: "Failed to send email", details: error.message });
    }
  });

  app.post("/api/auth/otp/verify", async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ error: "No active handshake found" });

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "Code expired" });
    }

    if (record.code !== code) {
      return res.status(400).json({ error: "Invalid code" });
    }

    // Success
    otpStore.delete(email);
    res.json({ success: true });
  });

  // Steam Authentication
  app.get("/api/auth/steam", (req, res) => {
    const forwardedProto = req.get("x-forwarded-proto");
    const protocol = forwardedProto || req.protocol;
    const host = req.get("host");
    const returnTo = `${protocol}://${host}/api/auth/steam/callback`;
    
    const params = new URLSearchParams({
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "checkid_setup",
      "openid.return_to": returnTo,
      "openid.realm": `${protocol}://${host}/`,
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    });

    res.redirect(`https://steamcommunity.com/openid/login?${params.toString()}`);
  });

  app.get("/api/auth/steam/callback", async (req, res) => {
    const params: any = req.query;
    
    // Validate assertion
    const validationParams = new URLSearchParams(params);
    validationParams.set("openid.mode", "check_authentication");

    try {
      const response = await axios.post(
        "https://steamcommunity.com/openid/login",
        validationParams.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.includes("is_valid:true")) {
        // Extract SteamID from the identity URL
        const openidIdentity = params["openid.identity"] || params["openid.claimed_id"] || "";
        // Steam IDs are 17-digit numbers starting with 7656
        const steamIdMatch = openidIdentity.match(/\/(?:id|profiles|openid\/id)\/(7656\d{13,})\/?$/);
        const steamId = steamIdMatch ? steamIdMatch[1] : null;

        console.log("Steam Auth Success - Identity:", openidIdentity, "Extracted ID:", steamId);

        if (steamId) {
          res.redirect(`/auth/callback/steam?steamId=${steamId}&loginSuccess=true`);
        } else {
          console.error("Steam Auth Error: Could not extract ID from", openidIdentity);
          res.redirect("/login?error=SteamID_extraction_failed");
        }
      } else {
        console.warn("Steam Auth Validation Failed:", response.data);
        res.redirect("/login?error=Steam_validation_failed");
      }
    } catch (error) {
      console.error("Steam Validation Error:", error);
      res.redirect("/login?error=Internal_server_error");
    }
  });

  // Steam API Proxy
  app.get("/api/steam/achievements", async (req, res) => {
    const { steamId, appId } = req.query;
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "STEAM_API_KEY not configured" });
    }

    if (!steamId || !appId) {
      return res.status(400).json({ error: "steamId and appId are required" });
    }

    try {
      // Get Player Achievements
      const achievementsResponse = await axios.get(
        `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/`,
        {
          params: {
            key: apiKey,
            steamid: steamId,
            appid: appId,
          },
        }
      );

      // Get Schema for Achievement Names (optional but nice)
      const schemaResponse = await axios.get(
        `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/`,
        {
          params: {
            key: apiKey,
            appid: appId,
          },
        }
      );

      res.json({
        achievements: achievementsResponse.data.playerstats.achievements || [],
        success: achievementsResponse.data.playerstats.success,
        gameName: schemaResponse.data.game.gameName,
      });
    } catch (error: any) {
      console.error("Steam API Error:", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: "Failed to fetch Steam data",
        details: error.response?.data || error.message,
      });
    }
  });

  // Get Player Summaries
  app.get("/api/steam/profile", async (req, res) => {
    const { steamId } = req.query;
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "STEAM_API_KEY not configured" });
    }

    if (!steamId) {
      return res.status(400).json({ error: "steamId is required" });
    }

    try {
      const response = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`,
        {
          params: {
            key: apiKey,
            steamids: steamId,
          },
        }
      );

      const players = response.data.response.players;
      if (!players || players.length === 0) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.json(players[0]);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({
        error: "Failed to fetch Steam profile",
        details: error.response?.data || error.message,
      });
    }
  });

  // Get Owned Games (to list them for the user)
  app.get("/api/steam/games", async (req, res) => {
    const { steamId } = req.query;
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "STEAM_API_KEY not configured" });
    }

    if (!steamId) {
      return res.status(400).json({ error: "steamId is required" });
    }

    try {
      const response = await axios.get(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`,
        {
          params: {
            key: apiKey,
            steamid: steamId,
            include_appinfo: 1,
            format: "json",
          },
        }
      );

      const steamResponse = response.data.response;
      
      if (!steamResponse || Object.keys(steamResponse).length === 0) {
        return res.status(404).json({ 
          error: "No games found or profile is private",
          details: "Make sure your Steam Profile and Game Details are set to 'Public' in privacy settings."
        });
      }

      res.json(steamResponse);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({
        error: "Failed to fetch Steam games",
        details: error.response?.data || error.message,
      });
    }
  });

  // Get News For App
  app.get("/api/steam/news", async (req, res) => {
    const { appId } = req.query;
    if (!appId) {
      return res.status(400).json({ error: "appId is required" });
    }

    try {
      const response = await axios.get(
        `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/`,
        {
          params: {
            appid: appId,
            count: 5,
            maxlength: 300,
            format: "json",
          },
        }
      );

      res.json(response.data.appnews.newsitems || []);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({
        error: "Failed to fetch Steam news",
        details: error.response?.data || error.message,
      });
    }
  });

  // Get QuestGate App News or Local Game Intel Updates
  app.get("/api/app/news", (req, res) => {
    const { originId } = req.query;
    
    const globalNews = [
      {
        title: "SYSTEM RELEASE: QUESTGATE V1.1.5 PROTOCOL STANDARDIZED",
        date: Math.floor(Date.now() / 1000) - 3600 * 2, // 2h ago
        url: "#",
        feedlabel: "QuestGate HQ Command",
        contents: "QuestGate core navigation systems have been fully optimized. This update introduces a dynamic aesthetic manager, fixed persistent navigation controllers, and improved responsive grid alignments. Steam synchronization gateways are confirmed functional and isolated."
      },
      {
        title: "STEAM GATEWAY INTEGRATION VERIFIED & SYNCED",
        date: Math.floor(Date.now() / 1000) - 3600 * 24, // 1 day ago
        url: "#",
        feedlabel: "QuestGate Core Dev",
        contents: "Automatic intelligence sync module is now online. Playtime metrics and achievement logs fetch dynamically via the ISteamNews endpoint. Encryption keys are fully contained server-side."
      },
      {
        title: "DATABASE INFRASTRUCTURE BACKUP COMPLETE",
        date: Math.floor(Date.now() / 1000) - 3600 * 24 * 3, // 3 days ago
        url: "#",
        feedlabel: "System Security Sentinel",
        contents: "Firestore clusters across primary and standby zones completed a full handshake with the security shield. All user progress states and local tactical parameters are backed up with 100% integrity."
      }
    ];

    const localAppNews: Record<string, any[]> = {
      "1": [ // VALORANT
        {
          title: "VALORANT PROTOCOL UPDATES: AGENT OVERHAUL",
          date: Math.floor(Date.now() / 1000) - 3600 * 4,
          url: "https://playvalorant.com",
          feedlabel: "Riot Games Dev Blog",
          contents: "Operation-level update: Controller agents have had their line-of-sight shrouds recalibrated. Shadow step displacement speeds have been increased by 14% to ensure quick entry into hot combat zones."
        },
        {
          title: "SINGAPORE SERVER SECTOR STABILIZED",
          date: Math.floor(Date.now() / 1000) - 3600 * 48,
          url: "https://playvalorant.com",
          feedlabel: "SEA Network Center",
          contents: "Fibre lines in the Southeast Asian corridor received hardware-level diagnostics. Packet loss values dropped to <0.02% across active gameplay hours. Signal matches are in optimal state."
        }
      ],
      "2": [ // ELDEN ROOT
        {
          title: "SHADOW OF THE ERDTREE CALIBRATION REPORT",
          date: Math.floor(Date.now() / 1000) - 3600 * 12,
          url: "https://eldenring.com",
          feedlabel: "FromSoftware Team",
          contents: "Tactical calibration: Land of Shadow exploration directives updated. Dynamic scaling parameters adjusted for the first-tier blessing matrices to ease early phase engagement curves."
        },
        {
          title: "RADAGON POSTURE RECOVERY ADAPTATION",
          date: Math.floor(Date.now() / 1000) - 3600 * 72,
          url: "https://eldenring.com",
          feedlabel: "Elden Lore Association",
          contents: "Internal research concludes that posture break recovery delays are best countered by jump-attacks equipped with heavy greatswords. Shield deflection parameters remain standard."
        }
      ],
      "3": [ // NEON BLADE
        {
          title: "NEON BLADE HIGH-SPEED DASH RECONSTRUCTION",
          date: Math.floor(Date.now() / 1000) - 3600 * 24,
          url: "#",
          feedlabel: "Cyberpunk Indie Lab",
          contents: "Software hotfix v1.4.0 deployed to correct clipping errors during high-velocity diagonal slide routines on sector 04 slopes. Ghost dash mechanics remain consistent with tactical expectations."
        }
      ],
      "4": [ // HALO
        {
          title: "UNSC SECTOR 04 DATA ENVELOPE DECRYPTED",
          date: Math.floor(Date.now() / 1000) - 3600 * 48,
          url: "#",
          feedlabel: "UNSC Commander Log",
          contents: "Intelligence from Installation 04 archives finished structural rendering. Plasma rifle heat dispersion ratings have been indexed for optimal shields depletion curves against armored units."
        }
      ]
    };

    if (originId && localAppNews[originId.toString()]) {
      return res.json(localAppNews[originId.toString()]);
    }

    res.json(globalNews);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
