// File: api/submissions.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET requests allowed' });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = {
    query: `
      query getRecentSubmissions($username: String!) {
        recentSubmissionList(username: $username) {
          title
          statusDisplay
          lang
          timestamp
        }
      }
    `,
    variables: { username },
  };

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      query,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data.data.recentSubmissionList;
    res.status(200).json(data);
  } catch (error) {
    console.error('LeetCode API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
}
