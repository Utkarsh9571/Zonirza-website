import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Helper to sanitize filenames
function generateSafeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext);
  
  // Replace non-alphanumeric chars with hyphens, convert to lowercase
  const sanitizedBase = base.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  // Append random string to prevent collisions
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  
  return `${sanitizedBase}-${randomSuffix}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    const category = formData.get('category') as string;
    const type = formData.get('type') as string || 'product'; // 'product' or 'blog'
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    if (type === 'product' && !category) {
      return NextResponse.json({ success: false, error: 'Category is required for product images' }, { status: 400 });
    }

    const uploadedFiles: { url: string; name: string }[] = [];

    // Base storage path outside repo
    const STORAGE_ROOT = process.env.STORAGE_ROOT || (process.platform === 'win32' ? 'C:/opt/zoniraz-storage' : '/opt/zoniraz-storage');

    for (const file of files) {
      // 2. Validation
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, error: `Invalid file type: ${file.type}. Allowed types are JPG, PNG, WEBP.` }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size is 5MB.` }, { status: 400 });
      }

      // 3. Process with sharp
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })

        .toBuffer();

      // 4. Generate filename and paths
      const safeName = generateSafeFilename(file.name) + '.webp';
      
      let relativeStoragePath = '';
      let urlPath = '';

      if (type === 'product') {
        relativeStoragePath = path.join('public', 'images', 'products', category.toLowerCase().replace(/[^a-z0-9]/g, '-'));
        urlPath = `/images/products/${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${safeName}`;
      } else if (type === 'blog') {
        relativeStoragePath = path.join('public', 'images', 'blogs', category.toLowerCase().replace(/[^a-z0-9]/g, '-')); // category here acts as slug
        urlPath = `/images/blogs/${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${safeName}`;
      } else {
        relativeStoragePath = path.join('public', 'images', 'misc');
        urlPath = `/images/misc/${safeName}`;
      }

      const absoluteStorageDir = path.join(STORAGE_ROOT, relativeStoragePath);
      const absoluteFilePath = path.join(absoluteStorageDir, safeName);

      // Ensure directory exists
      await fs.mkdir(absoluteStorageDir, { recursive: true });

      // Save file
      await fs.writeFile(absoluteFilePath, optimizedBuffer);

      uploadedFiles.push({
        url: urlPath,
        name: safeName
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`
    });

  } catch (error: unknown) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: (error instanceof Error ? error.message : String(error)) || 'Internal Server Error' }, { status: 500 });
  }
}
