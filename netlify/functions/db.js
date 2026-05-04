// Helper to manage a shared PostgreSQL pool across warm invocations.
import pkg from 'pg';

const { Pool } = pkg;

let pool;

export async function getClient() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }

  return pool;
}
