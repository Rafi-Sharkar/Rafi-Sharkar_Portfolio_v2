// AWS S3 helper. Single source of truth for the S3 client + upload / delete
// operations. Credentials are read from .env at boot — no need to pass them
// around. Every object uploaded via `uploadToS3` is tagged with the supplied
// `folder` so they group nicely in the S3 console.
//
//   s3/profile/<uuid>.jpg
//   s3/gallery/<uuid>.jpg
//   s3/certificates/<uuid>.jpg
//   s3/projects/<uuid>.jpg
//
// Public-read ACL is set on every upload so the public pages can load the
// resulting URL directly. If the bucket blocks ACLs (some newer buckets do),
// a one-time bucket policy fix is needed — see the README.

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET_NAME;

export const S3_BUCKET = bucket;
export const S3_REGION = region;

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export function publicUrlFor(key) {
  if (!bucket || !region) return '';
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

// Map a MIME type to a sensible file extension. Falls back to a generic "bin"
// for anything not in the whitelist so we never hand out a malformed key.
const EXT_FOR_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

// Generate a short, URL-safe random ID. We don't need full UUIDs here —
// 12 chars from crypto is plenty to avoid collisions in a single-user
// portfolio app.
function randomId() {
  // 9 bytes -> 12 base64url chars (no padding needed).
  return require('crypto').randomBytes(9).toString('base64url');
}

/**
 * Upload a file to S3.
 *
 * @param {object} args
 * @param {Buffer} args.buffer        — file contents as a Buffer (Node only).
 * @param {string} args.contentType   — MIME type (must be in the upload-route whitelist).
 * @param {string} args.originalName  — original filename (used only for extension fallback).
 * @param {string} args.folder        — one of 'profile' | 'gallery' | 'certificates' | 'projects'.
 * @returns {Promise<{ key: string, url: string, contentType: string, size: number }>}
 */
export async function uploadToS3({ buffer, contentType, originalName, folder }) {
  if (!bucket || !region) {
    throw new Error('S3 is not configured: AWS_REGION and AWS_S3_BUCKET_NAME must be set');
  }
  if (!buffer || !buffer.length) {
    throw new Error('Empty file buffer');
  }
  if (!folder) {
    throw new Error('folder is required (profile | gallery | certificates | projects)');
  }

  const ext = EXT_FOR_MIME[contentType] || (originalName?.split('.').pop() || 'bin').toLowerCase();
  const key = `${folder}/${Date.now()}-${randomId()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // NOTE: We do NOT set ACL here. Modern S3 buckets have ACLs disabled
      // (the default since April 2023), which makes `ACL: 'public-read'`
      // throw "The bucket does not allow ACLs". Public-read access is
      // granted at the bucket level via a bucket policy like:
      //
      //   {
      //     "Effect": "Allow",
      //     "Principal": "*",
      //     "Action": "s3:GetObject",
      //     "Resource": "arn:aws:s3:::riazs3/*"
      //   }
      //
      // See README for the one-time setup command.
    })
  );

  return {
    key,
    url: publicUrlFor(key),
    contentType,
    size: buffer.length,
  };
}

/**
 * Delete an object from S3 by its key. Silent on failure (best-effort) so
 * the caller's DB delete still succeeds even if the S3 object is already
 * gone or the bucket is unreachable.
 */
export async function deleteFromS3(key) {
  if (!key || !bucket) return;
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (err) {
    console.warn('[s3] delete failed for key:', key, err?.message);
  }
}

/**
 * Extract the S3 key from a public URL produced by `publicUrlFor`. Returns
 * null if the URL isn't one of ours (e.g. a localhost /assets/... path).
 */
export function keyFromUrl(url) {
  if (!url || !bucket || !region) return null;
  const prefix = publicUrlFor('');
  if (!url.startsWith(prefix)) return null;
  return url.slice(prefix.length);
}