// Helper to manage a single PG client across warm invocations.
import pkg from 'pg';

const { Client } = pkg;

let clientPromise;

export async function getClient() {
  if (!clientPromise) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    clientPromise = client.connect().then(() => client);
  }

  return clientPromise;
}
