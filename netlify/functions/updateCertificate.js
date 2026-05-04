import { getClient } from './db.js';
import { json, getQueryId, parseJsonBody } from './_http.js';

export async function handler(event) {
  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseJsonBody(event);
  const id = body.id ?? getQueryId(event);

  if (!id) {
    return json(400, { error: 'Missing certificate id' });
  }

  try {
    const client = await getClient();
    const result = await client.query(
      `UPDATE certificates
       SET title = COALESCE($2, title),
           issuer = COALESCE($3, issuer),
           date = COALESCE($4, date),
           credential_url = COALESCE($5, credential_url)
       WHERE id = $1
       RETURNING id, title, issuer, date, credential_url`,
      [id, body.title ?? null, body.issuer ?? null, body.date ?? null, body.credential_url ?? null],
    );

    return result.rowCount === 0 ? json(404, { error: 'Certificate not found' }) : json(200, result.rows[0]);
  } catch (error) {
    console.error('updateCertificate error', error);
    return json(500, { error: error.message || 'Internal Server Error' });
  }
}
