const express = require('express');
const router = express.Router();

async function canvasFetch(canvasUrl, token, path) {
  const res = await fetch(`${canvasUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(data?.errors?.[0]?.message || data?.message || `Canvas request failed: ${res.status}`);
  }

  return data;
}

router.post('/test', async (req, res) => {
  try {
    const { canvasUrl, canvasToken } = req.body;

    if (!canvasUrl || !canvasToken) {
      return res.status(400).json({ error: 'Canvas URL and token are required.' });
    }

    const user = await canvasFetch(canvasUrl, canvasToken, '/api/v1/users/self');
    res.json({ user });
  } catch (error) {
    console.error('Canvas test error:', error);
    res.status(500).json({ error: error.message || 'Failed to connect to Canvas.' });
  }
});

router.post('/assignments', async (req, res) => {
  try {
    const { canvasUrl, canvasToken } = req.body;

    if (!canvasUrl || !canvasToken) {
      return res.status(400).json({ error: 'Canvas URL and token are required.' });
    }

    const courses = await canvasFetch(
      canvasUrl,
      canvasToken,
      '/api/v1/courses?enrollment_state=active&state[]=available&per_page=50'
    );

    const courseMap = new Map(
      courses.map((course) => [course.id, course.name])
    );

    const assignmentResults = await Promise.all(
      courses.map(async (course) => {
        try {
          const assignments = await canvasFetch(
            canvasUrl,
            canvasToken,
            `/api/v1/courses/${course.id}/assignments?bucket=upcoming&per_page=20`
          );

          return assignments.map((assignment) => ({
            id: `${course.id}-${assignment.id}`,
            name: assignment.name,
            courseName: courseMap.get(course.id) || 'Unknown Course',
            dueAt: assignment.due_at
              ? new Date(assignment.due_at).toLocaleString()
              : null,
            pointsPossible: assignment.points_possible,
            rawDueAt: assignment.due_at,
          }));
        } catch {
          return [];
        }
      })
    );

    const flattened = assignmentResults
      .flat()
      .sort((a, b) => {
        if (!a.rawDueAt && !b.rawDueAt) return 0;
        if (!a.rawDueAt) return 1;
        if (!b.rawDueAt) return -1;
        return new Date(a.rawDueAt) - new Date(b.rawDueAt);
      });

    res.json({ assignments: flattened });
  } catch (error) {
    console.error('Canvas assignments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch Canvas assignments.' });
  }
});

module.exports = router;