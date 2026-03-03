import { put, del } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      return await handleUpload(req, res);
    }
    if (req.method === 'DELETE') {
      return await handleDelete(req, res);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

async function handleUpload(req, res) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File too large (max 5MB)' });
  }

  const filename = req.headers['x-filename'] || 'photo.jpg';

  // Buffer the body instead of streaming req directly
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);

  const blob = await put(`cards/${filename}`, body, {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });

  return res.status(200).json({ url: blob.url });
}

async function handleDelete(req, res) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString());

  const { url } = body;
  if (!url) {
    return res.status(400).json({ error: 'Missing url' });
  }

  await del(url);
  return res.status(200).json({ success: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
