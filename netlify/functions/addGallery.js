import { getClient } from './db.js';
import { json, parseJsonBody } from './_http.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseJsonBody(event);
  const { image_url, caption } = body;

  if (!image_url) {
    return json(400, { error: 'Missing image_url' });
  }

  try {
    const client = await getClient();
    const result = await client.query(
      `INSERT INTO gallery (image_url, caption)
       VALUES ($1, $2)
       RETURNING id, image_url, caption, created_at`,
      [image_url, caption ?? null],
    );

    return json(201, result.rows[0]);
  } catch (error) {
    console.error('addGallery error', error);
    return json(500, { error: error.message || 'Internal Server Error' });
  }
}
