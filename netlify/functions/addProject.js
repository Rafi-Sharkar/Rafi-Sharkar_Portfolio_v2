/*
  Netlify Function: addProject
  - Accepts POST JSON body to insert a new project into PostgreSQL.
*/
import { getClient } from './db.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { title, description, github_link, live_link } = body;

    if (!title || !description) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing title or description' }),
      };
    }

    const client = await getClient();
    const insertQuery = `
      INSERT INTO projects (title, description, github_link, live_link)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, github_link, live_link, created_at
    `;

    const values = [title, description, github_link || null, live_link || null];
    const result = await client.query(insertQuery, values);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.rows[0]),
    };
  } catch (error) {
    console.error('addProject error', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
}
