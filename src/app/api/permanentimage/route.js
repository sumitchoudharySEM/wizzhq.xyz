export const dynamic = "force-dynamic";

import { rename, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { tempPath, oldPath } = await request.json();

    if (!tempPath) {
      return NextResponse.json(
        { error: 'No temporary path provided' },
        { status: 400 }
      );
    }

    // Convert full URLs to relative paths for file operations
    const relativeTempPath = tempPath.replace(process.env.NEXT_PUBLIC_BASE_URL, '');
    const relativeOldPath = oldPath?.replace(process.env.NEXT_PUBLIC_BASE_URL, '');

    // Only attempt to delete old image if it's a local file (starts with /uploads/)
    if (relativeOldPath?.startsWith('/uploads/')) {
      const oldFullPath = join(process.cwd(), 'public', relativeOldPath);
      if (existsSync(oldFullPath)) {
        await unlink(oldFullPath);
      }
    }

    // Move temp file to permanent storage
    const tempFullPath = join(process.cwd(), 'public', relativeTempPath);
    const newFilename = relativeTempPath.split('/').pop();
    const relativePermanentPath = `/uploads/permanent/${newFilename}`;
    const permanentFullPath = join(process.cwd(), 'public', 'uploads', 'permanent', newFilename);
    const permanentPath = `${process.env.NEXT_PUBLIC_BASE_URL}${relativePermanentPath}`;

    await rename(tempFullPath, permanentFullPath);

    return NextResponse.json({ 
      permanentPath,
      message: 'Image moved to permanent storage' 
    });
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json(
      { error: 'Error moving file to permanent storage' },
      { status: 500 }
    );
  }
}