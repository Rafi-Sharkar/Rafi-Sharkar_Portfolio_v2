// POST /api/upload — admin-only media upload to AWS S3.
// Accepts multipart/form-data with `file` and `folder`. Returns the public
// URL the admin form should save into its image_url / profilePic field.
//
//   curl -F file=@photo.jpg -F folder=gallery http://localhost:3000/api/upload \
//        -b "admin_session=..." -H "Cookie: ..."
//
// Response: { url, key, contentType, size, originalName }

import { NextResponse } from 'next/server';
import { readSessionFromRequest, verifySession } from '@/lib/auth';
import { uploadToS3 } from '@/lib/s3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cap uploads at 50 MB. Configurable per project via UPLOAD_MAX_BYTES env if
// needed; 50 MB is enough for hero videos and high-res photos.
const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 50 * 1024 * 1024);

// Whitelist of MIME types we accept. Keep this narrow on purpose — we do NOT
// want to be a general-purpose file host. Add types here if the user
// requests new formats.
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const ALLOWED_FOLDERS = new Set(['profile', 'gallery', 'certificates', 'projects']);

export async function POST(request) {
  const session = await verifySession(readSessionFromRequest(request));
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid multipart body — expected multipart/form-data with `file` field' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  const folder = formData.get('folder');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Missing `file` field in upload' }, { status: 400 });
  }
  if (!folder || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json(
      { error: `Missing or invalid 'folder' field — must be one of ${[...ALLOWED_FOLDERS].join(', ')}` },
      { status: 400 }
    );
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || 'unknown'}. Allowed: ${[...ALLOWED_MIME].join(', ')}` },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large: ${file.size} bytes (max ${MAX_BYTES})` },
      { status: 413 }
    );
  }

  // File -> Buffer for the AWS SDK.
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await uploadToS3({
      buffer,
      contentType: file.type,
      originalName: file.name || 'upload',
      folder,
    });

    return NextResponse.json({
      url: result.url,
      key: result.key,
      contentType: result.contentType,
      size: result.size,
      originalName: file.name || null,
    });
  } catch (err) {
    console.error('[upload] S3 upload failed:', err);
    return NextResponse.json(
      { error: `S3 upload failed: ${err.message || 'unknown error'}` },
      { status: 502 }
    );
  }
}