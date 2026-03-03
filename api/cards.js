import { neon } from '@neondatabase/serverless';

function getSQL() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing POSTGRES_URL or DATABASE_URL env var');
  return neon(url);
}

export default async function handler(req, res) {
  try {
    const sql = getSQL();

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, emoji, photo_url AS "photoURL", th, en, category
        FROM custom_cards
        ORDER BY created_at ASC
      `;
      return res.status(200).json({ cards: rows });
    }

    if (req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const card = JSON.parse(Buffer.concat(chunks).toString());
      if (!card.id) {
        return res.status(400).json({ error: 'Missing card id' });
      }
      await sql`
        INSERT INTO custom_cards (id, emoji, photo_url, th, en, category)
        VALUES (${card.id}, ${card.emoji || null}, ${card.photoURL || null}, ${card.th || ''}, ${card.en || ''}, ${card.category || 'custom'})
        ON CONFLICT (id) DO NOTHING
      `;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
      }
      await sql`DELETE FROM custom_cards WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /api/cards error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
