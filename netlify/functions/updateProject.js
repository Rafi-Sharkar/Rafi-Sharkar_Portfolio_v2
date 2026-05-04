import { getClient } from './db.js';
import { json, getQueryId, parseJsonBody } from './_http.js';

export async function handler(event) {
  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseJsonBody(event);
  const id = body.id ?? getQueryId(event);

  if (!id) {
    return json(400, { error: 'Missing project id' });
  }

  const { title, description, github_link, live_link } = body;

  try {
    const client = await getClient();
    const result = await client.query(
      `UPDATE projects
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           github_link = COALESCE($4, github_link),
           live_link = COALESCE($5, live_link)
       WHERE id = $1
       RETURNING id, title, description, github_link, live_link, created_at`,
      [id, title ?? null, description ?? null, github_link ?? null, live_link ?? null],
    );

    return result.rowCount === 0 ? json(404, { error: 'Project not found' }) : json(200, result.rows[0]);
  } catch (error) {
    console.error('updateProject error', error);
    return json(500, { error: 'Internal Server Error' });
  }
}
