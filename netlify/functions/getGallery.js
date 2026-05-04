import { getClient } from './db.js';
import { json } from './_http.js';

export async function handler() {
  try {
    const client = await getClient();
    const result = await client.query(
      `SELECT id, image_url, caption, created_at
       FROM gallery
       ORDER BY created_at DESC, id DESC`,
    );

    return json(200, result.rows);
  } catch (error) {
    console.error('getGallery error', error);
    return json(500, { error: 'Internal Server Error' });
  }
}
