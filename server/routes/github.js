const express = require('express')
const router = express.Router()
const axios = require('axios')

// GET /api/github/user?username=torvalds
router.get('/user', async (req, res) => {
  const { username } = req.query
  if (!username) return res.status(400).json({ error: 'Username is required' })

  try {
    const headers = {}
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, { headers }),
    ])

    const user = userRes.data
    const repos = reposRes.data.map(r => ({
      name:        r.name,
      description: r.description,
      stars:       r.stargazers_count,
      forks:       r.fork_count,
      language:    r.language,
      url:         r.html_url,
      updatedAt:   r.updated_at,
    }))

    res.json({
      username:   user.login,
      name:       user.name,
      avatar:     user.avatar_url,
      bio:        user.bio,
      followers:  user.followers,
      following:  user.following,
      publicRepos: user.public_repos,
      profileUrl: user.html_url,
      repos,
    })
  } catch (err) {
    const status = err.response?.status
    if (status === 404) return res.status(404).json({ error: 'GitHub user not found.' })
    if (status === 403) return res.status(403).json({ error: 'GitHub rate limit hit. Add a GITHUB_TOKEN to .env to increase limits.' })
    res.status(500).json({ error: 'Failed to fetch GitHub data.' })
  }
})

module.exports = router