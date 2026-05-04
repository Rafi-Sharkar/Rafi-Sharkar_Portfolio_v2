import { getClient } from './db.js';
import { json, parseJsonBody } from './_http.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  const body = parseJsonBody(event);

  if (!body.title) {
    return json(400, { error: 'Missing title' });
  }

  try {
    const client = await getClient();
    const result = await client.query(
      `INSERT INTO certificates (title, issuer, date, credential_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, issuer, date, credential_url`,
      [body.title, body.issuer ?? null, body.date ?? null, body.credential_url ?? null],
    );

    return json(201, result.rows[0]);
  } catch (error) {
    console.error('addCertificate error', error);
    return json(500, { error: error.message || 'Internal Server Error' });
  }
}
