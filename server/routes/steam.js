    const express = require('express');

const router = express.Router();

// Curated list for MVP
const FEATURED_GAMES = [
  { appid: 2868840, name: 'Slay the Spire 2' },
  { appid: 413150, name: 'Stardew Valley' },
  { appid: 367520, name: 'Hollow Knight' },
  { appid: 1145360, name: 'Hades' },
  { appid: 1245620, name: 'ELDEN RING' },
  { appid: 1091500, name: 'Cyberpunk 2077' },
];

async function fetchSteamAppDetails(appid) {
  const response = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${appid}`
  );

  const data = await response.json();
  const entry = data[String(appid)];

  if (!entry?.success || !entry?.data) {
    return null;
  }

  const game = entry.data;

  return {
    appid,
    name: game.name,
    shortDescription: game.short_description || '',
    headerImage: game.header_image || '',
    capsuleImage: game.capsule_image || '',
    isFree: Boolean(game.is_free),
    price:
      game.price_overview?.final_formatted ||
      (game.is_free ? 'Free' : null),
    storeUrl: `https://store.steampowered.com/app/${appid}`,
  };
}

router.get('/featured', async (req, res) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();

    const filtered = q
      ? FEATURED_GAMES.filter((game) =>
          game.name.toLowerCase().includes(q)
        )
      : FEATURED_GAMES;

    const results = await Promise.all(
      filtered.map((game) => fetchSteamAppDetails(game.appid))
    );

    res.json({
      items: results.filter(Boolean),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Steam featured route error:', error);
    }
    res.status(500).json({
      error: 'Internal server error while fetching Steam games.',
    });
  }
});

module.exports = router;