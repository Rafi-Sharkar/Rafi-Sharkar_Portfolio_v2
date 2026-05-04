import { getClient } from './db.js';
import { json, getQueryId, parseJsonBody } from './_http.js';

export async function handler(event) {
  if (event.httpMethod !== 'DELETE' && event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseJsonBody(event);
  const id = body.id ?? getQueryId(event);

  if (!id) {
    return json(400, { error: 'Missing project id' });
  }

  try {
    const client = await getClient();
    const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    return result.rowCount === 0 ? json(404, { error: 'Project not found' }) : json(200, { deleted: true, id: result.rows[0].id });
  } catch (error) {
    console.error('deleteProject error', error);
    return json(500, { error: 'Internal Server Error' });
  }
}
