import { neon } from '@neondatabase/serverless';

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('Missing POSTGRES_URL or DATABASE_URL env var');
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS custom_cards (
    id         VARCHAR(64) PRIMARY KEY,
    emoji      VARCHAR(16),
    photo_url  TEXT,
    th         VARCHAR(255) NOT NULL DEFAULT '',
    en         VARCHAR(255) NOT NULL DEFAULT '',
    category   VARCHAR(32) NOT NULL DEFAULT 'custom',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )
`;

console.log('Table custom_cards created (or already exists).');
