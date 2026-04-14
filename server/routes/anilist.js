const express = require('express');

const router = express.Router();

const ANILIST_URL = 'https://graphql.anilist.co';

function getTodayRangeUtc() {
  const now = new Date();

  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0
  ));

  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59
  ));

  return {
    start: Math.floor(start.getTime() / 1000),
    end: Math.floor(end.getTime() / 1000),
  };
}

function getWeekRangeUtc() {
  const now = new Date();
  const start = Math.floor(now.getTime() / 1000);

  const end = new Date(now);
  end.setUTCDate(end.getUTCDate() + 7);

  return {
    start,
    end: Math.floor(end.getTime() / 1000),
  };
}

function getCurrentSeasonInfo() {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();

  if (month >= 1 && month <= 3) return { season: 'WINTER', year };
  if (month >= 4 && month <= 6) return { season: 'SPRING', year };
  if (month >= 7 && month <= 9) return { season: 'SUMMER', year };
  return { season: 'FALL', year };
}

function getNextSeasonInfo() {
  const { season, year } = getCurrentSeasonInfo();

  if (season === 'WINTER') return { season: 'SPRING', year };
  if (season === 'SPRING') return { season: 'SUMMER', year };
  if (season === 'SUMMER') return { season: 'FALL', year };
  return { season: 'WINTER', year: year + 1 };
}

async function postAniListQuery(query, variables) {
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();

  if (!response.ok || data.errors) {
    throw new Error(
      data?.errors?.[0]?.message || 'AniList request failed.'
    );
  }

  return data.data;
}

router.get('/today', async (_req, res) => {
  try {
    const { start, end } = getTodayRangeUtc();

    const query = `
      query ($page: Int, $perPage: Int, $start: Int, $end: Int) {
        Page(page: $page, perPage: $perPage) {
          airingSchedules(
            airingAt_greater: $start
            airingAt_lesser: $end
            sort: TIME
          ) {
            episode
            airingAt
            media {
              id
              siteUrl
              episodes
              status
              season
              seasonYear
              title {
                romaji
                english
              }
              coverImage {
                large
                medium
              }
            }
          }
        }
      }
    `;

    const data = await postAniListQuery(query, {
      page: 1,
      perPage: 20,
      start,
      end,
    });

    const items = (data.Page.airingSchedules || []).map((item) => ({
      id: item.media.id,
      episode: item.episode,
      airingAt: item.airingAt,
      title: item.media.title.english || item.media.title.romaji,
      coverImage: item.media.coverImage.large || item.media.coverImage.medium,
      siteUrl: item.media.siteUrl,
      status: item.media.status,
      season: item.media.season,
      seasonYear: item.media.seasonYear,
      totalEpisodes: item.media.episodes,
    }));

    res.json({ items });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('AniList today route error:', error);
    }
    res.status(500).json({ error: error.message || 'Failed to fetch airing anime.' });
  }
});

router.get('/week', async (_req, res) => {
  try {
    const { start, end } = getWeekRangeUtc();

    const query = `
      query ($page: Int, $perPage: Int, $start: Int, $end: Int) {
        Page(page: $page, perPage: $perPage) {
          airingSchedules(
            airingAt_greater: $start
            airingAt_lesser: $end
            sort: TIME
          ) {
            episode
            airingAt
            media {
              id
              siteUrl
              episodes
              status
              season
              seasonYear
              title {
                romaji
                english
              }
              coverImage {
                large
                medium
              }
            }
          }
        }
      }
    `;

    const data = await postAniListQuery(query, {
      page: 1,
      perPage: 40,
      start,
      end,
    });

    const items = (data.Page.airingSchedules || []).map((item) => ({
      id: item.media.id,
      episode: item.episode,
      airingAt: item.airingAt,
      title: item.media.title.english || item.media.title.romaji,
      coverImage: item.media.coverImage.large || item.media.coverImage.medium,
      siteUrl: item.media.siteUrl,
      status: item.media.status,
      season: item.media.season,
      seasonYear: item.media.seasonYear,
      totalEpisodes: item.media.episodes,
    }));

    res.json({ items });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('AniList week route error:', error);
    }
    res.status(500).json({ error: error.message || 'Failed to fetch weekly anime schedule.' });
  }
});

router.get('/season', async (_req, res) => {
  try {
    const { season, year } = getNextSeasonInfo();

    const query = `
      query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
        Page(page: $page, perPage: $perPage) {
          media(
            type: ANIME
            season: $season
            seasonYear: $seasonYear
            sort: POPULARITY_DESC
          ) {
            id
            siteUrl
            status
            episodes
            season
            seasonYear
            title {
              romaji
              english
            }
            coverImage {
              large
              medium
            }
            nextAiringEpisode {
              episode
              airingAt
            }
          }
        }
      }
    `;

    const data = await postAniListQuery(query, {
      page: 1,
      perPage: 20,
      season,
      seasonYear: year,
    });

    const items = (data.Page.media || []).map((item) => ({
      id: item.id,
      episode: item.nextAiringEpisode?.episode ?? null,
      airingAt: item.nextAiringEpisode?.airingAt ?? null,
      title: item.title.english || item.title.romaji,
      coverImage: item.coverImage.large || item.coverImage.medium,
      siteUrl: item.siteUrl,
      status: item.status,
      season: item.season,
      seasonYear: item.seasonYear,
      totalEpisodes: item.episodes,
    }));

    res.json({
      season,
      year,
      items,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('AniList season route error:', error);
    }
    res.status(500).json({ error: error.message || 'Failed to fetch upcoming seasonal anime.' });
  }
});

module.exports = router;