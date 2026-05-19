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

      res.json(response.data.response);
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
