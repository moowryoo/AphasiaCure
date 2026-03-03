import { put, del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleUpload(req, res);
  }
  if (req.method === 'DELETE') {
    return handleDelete(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
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

  const blob = await put(`cards/${filename}`, req, {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });

  return res.status(200).json({ url: blob.url });
}

async function handleDelete(req, res) {
  const body = await new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });

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
