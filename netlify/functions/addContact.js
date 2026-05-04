import { getClient } from './db.js';
import { json, parseJsonBody } from './_http.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseJsonBody(event);
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return json(400, { error: 'Missing name, email, or message' });
  }

  try {
    const client = await getClient();
    const result = await client.query(
      `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, message, created_at`,
      [name, email, message],
    );

    return json(201, result.rows[0]);
  } catch (error) {
    console.error('addContact error', error);
    return json(500, { error: 'Internal Server Error' });
  }
}
