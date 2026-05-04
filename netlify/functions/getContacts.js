import { getClient } from './db.js';
import { json } from './_http.js';

export async function handler() {
  try {
    const client = await getClient();
    const result = await client.query(
      `SELECT id, name, email, message, created_at
       FROM contacts
       ORDER BY created_at DESC, id DESC`,
    );

    return json(200, result.rows);
  } catch (error) {
    console.error('getContacts error', error);
    return json(500, { error: 'Internal Server Error' });
  }
}
