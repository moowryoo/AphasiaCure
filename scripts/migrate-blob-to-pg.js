import { list } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!pgUrl) {
  console.error('Missing POSTGRES_URL or DATABASE_URL env var');
  process.exit(1);
}

const sql = neon(pgUrl);

const METADATA_PATH = 'cards/metadata.json';
const { blobs } = await list({ prefix: METADATA_PATH });
const match = blobs.find((b) => b.pathname === METADATA_PATH);

if (!match) {
  console.log('No metadata.json found in Blob storage. Nothing to migrate.');
  process.exit(0);
}

const res = await fetch(match.url, {
  headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
});

if (!res.ok) {
  console.error('Failed to fetch metadata.json:', res.status, res.statusText);
  process.exit(1);
}

const data = await res.json();
const cards = data.cards || [];

if (cards.length === 0) {
  console.log('No cards found in metadata.json.');
  process.exit(0);
}

console.log(`Migrating ${cards.length} card(s)...`);

for (const card of cards) {
  await sql`
    INSERT INTO custom_cards (id, emoji, photo_url, th, en, category)
    VALUES (${card.id}, ${card.emoji || null}, ${card.photoURL || null}, ${card.th || ''}, ${card.en || ''}, ${card.category || 'custom'})
    ON CONFLICT (id) DO NOTHING
  `;
  console.log(`  Inserted: ${card.id}`);
}

console.log('Migration complete.');
