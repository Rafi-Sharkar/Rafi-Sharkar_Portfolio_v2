/*
  Netlify Function: getProjects
  - Fetches all projects from PostgreSQL.
  - Returns a JSON array.
*/
import { getClient } from './db.js';

export async function handler() {
  try {
    const client = await getClient();

    const result = await client.query(
      `SELECT id, title, description, github_link, live_link, created_at
       FROM projects
       ORDER BY created_at DESC`
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.rows),
    };
  } catch (err) {
    console.error('getProjects error', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
