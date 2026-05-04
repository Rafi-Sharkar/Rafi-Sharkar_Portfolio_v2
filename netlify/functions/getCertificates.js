import { getClient } from './db.js';
import { json } from './_http.js';

export async function handler() {
  try {
    const client = await getClient();
    const result = await client.query(
      `SELECT id, title, issuer, date, credential_url
       FROM certificates
       ORDER BY id DESC`,
    );

    return json(200, result.rows);
  } catch (error) {
    console.error('getCertificates error', error);
    return json(500, { error: 'Internal Server Error' });
  }
}
