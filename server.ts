import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
          res.redirect(`/login?steamId=${steamId}&loginSuccess=true`);
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
