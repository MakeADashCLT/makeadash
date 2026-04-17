const express = require('express')
const router = express.Router()
const axios = require('axios')

const CLIENT_URL = process.env.CLIENT_URL || 'https://www.makeadash.tech'
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'https://www.makeadash.tech/api/spotify/callback'

function getBasicToken() {
  return Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
}

async function refreshAccessToken(refreshToken) {
  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)
  const res = await axios.post('https://accounts.spotify.com/api/token', params, {
    headers: { Authorization: `Basic ${getBasicToken()}`, 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data
}

async function getValidToken(req) {
  const sp = req.session.spotify
  if (!sp) return null
  if (Date.now() < (sp.expiresAt || 0) - 60_000) return sp.accessToken
  if (!sp.refreshToken) return null
  const refreshed = await refreshAccessToken(sp.refreshToken)
  req.session.spotify = {
    ...sp,
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token || sp.refreshToken,
    expiresAt: Date.now() + (refreshed.expires_in || 3600) * 1000,
  }
  return req.session.spotify.accessToken
}

// GET /api/spotify/login  — redirect user to Spotify auth
router.get('/login', (req, res) => {
  const scope = [
    'user-read-email', 'user-read-private',
    'user-read-currently-playing', 'user-read-playback-state',
    'user-top-read', 'user-read-recently-played',
  ].join(' ')
  const state = Math.random().toString(36).slice(2)
  req.session.spotifyState = state
  const params = new URLSearchParams({
    response_type: 'code', client_id: process.env.SPOTIFY_CLIENT_ID,
    scope, redirect_uri: REDIRECT_URI, state, show_dialog: 'true',
  })
  res.redirect(`https://accounts.spotify.com/authorize?${params}`)
})

// GET /api/spotify/callback
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query
  if (error || !code || state !== req.session.spotifyState) {
    return res.redirect(`${CLIENT_URL}/dashboard?spotify=error`)
  }
  try {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', REDIRECT_URI)
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: { Authorization: `Basic ${getBasicToken()}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    req.session.spotify = {
      accessToken: tokenRes.data.access_token,
      refreshToken: tokenRes.data.refresh_token,
      expiresAt: Date.now() + (tokenRes.data.expires_in || 3600) * 1000,
    }
    delete req.session.spotifyState
    res.redirect(`${CLIENT_URL}/dashboard?spotify=connected`)
  } catch (err) {
    console.error('Spotify callback error:', err.response?.data || err.message)
    res.redirect(`${CLIENT_URL}/dashboard?spotify=error`)
  }
})

// GET /api/spotify/status
router.get('/status', (req, res) => {
  res.json({ connected: !!req.session.spotify })
})

// GET /api/spotify/disconnect
router.get('/disconnect', (req, res) => {
  delete req.session.spotify
  delete req.session.spotifyState
  res.json({ success: true })
})

router.get('/debug', (req, res) => {
  res.json({
    spotifyState: req.session.spotifyState || null,
    spotifySession: req.session.spotify || null,
  });
});

// GET /api/spotify/me  — main data endpoint
router.get('/me', async (req, res) => {
  try {
    const token = await getValidToken(req)
    if (!token) return res.status(401).json({ error: 'Not connected to Spotify.' })

    const headers = { Authorization: `Bearer ${token}` }
    const ok = (s) => s >= 200 && s < 500

    const [profileRes, currentRes, topRes, recentRes] = await Promise.allSettled([
      axios.get('https://api.spotify.com/v1/me', { headers }),
      axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers, validateStatus: ok }),
      axios.get('https://api.spotify.com/v1/me/top/tracks?limit=6&time_range=short_term', { headers }),
      axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=6', { headers, validateStatus: ok }),
    ])

    const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
    const curRaw  = currentRes.status === 'fulfilled' ? currentRes.value : null
    const topRaw  = topRes.status === 'fulfilled' ? topRes.value.data : { items: [] }
    const recRaw  = recentRes.status === 'fulfilled' ? recentRes.value.data : { items: [] }

    const current = curRaw?.status === 200 && curRaw.data?.item ? {
      isPlaying:   curRaw.data.is_playing,
      progressMs:  curRaw.data.progress_ms,
      durationMs:  curRaw.data.item.duration_ms,
      track: {
        name:    curRaw.data.item.name,
        artists: curRaw.data.item.artists.map(a => a.name).join(', '),
        album:   curRaw.data.item.album?.name,
        image:   curRaw.data.item.album?.images?.[0]?.url || null,
        url:     curRaw.data.item.external_urls?.spotify || null,
      },
    } : null

    const topTracks = (topRaw.items || []).map(t => ({
      id: t.id, name: t.name,
      artists: t.artists.map(a => a.name).join(', '),
      album: t.album?.name,
      image: t.album?.images?.[0]?.url || null,
      url: t.external_urls?.spotify || null,
    }))

    const recentTracks = (recRaw.items || []).map(item => ({
      id: item.track?.id || item.played_at,
      name: item.track?.name,
      artists: item.track?.artists?.map(a => a.name).join(', '),
      album: item.track?.album?.name,
      image: item.track?.album?.images?.[0]?.url || null,
      playedAt: item.played_at,
      url: item.track?.external_urls?.spotify || null,
    }))

    res.json({
      connected: true,
      profile: profile ? {
        displayName: profile.display_name,
        email: profile.email,
        avatar: profile.images?.[0]?.url || null,
        profileUrl: profile.external_urls?.spotify || null,
        product: profile.product || 'spotify',
      } : null,
      current, topTracks, recentTracks,
    })
  } catch (err) {
    console.error('Spotify /me error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to fetch Spotify data.' })
  }
})

module.exports = router
