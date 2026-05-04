import { getClient } from './db.js';
import { json, getQueryId, parseJsonBody } from './_http.js';

export async function handler(event) {
  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseJsonBody(event);
  const id = body.id ?? getQueryId(event);

  if (!id) {
    return json(400, { error: 'Missing gallery id' });
  }

  try {
    const client = await getClient();
    const result = await client.query(
      `UPDATE gallery
       SET image_url = COALESCE($2, image_url),
           caption = COALESCE($3, caption)
       WHERE id = $1
       RETURNING id, image_url, caption, created_at`,
      [id, body.image_url ?? null, body.caption ?? null],
    );

    return result.rowCount === 0 ? json(404, { error: 'Gallery item not found' }) : json(200, result.rows[0]);
  } catch (error) {
    console.error('updateGallery error', error);
    return json(500, { error: 'Internal Server Error' });
  }
}
