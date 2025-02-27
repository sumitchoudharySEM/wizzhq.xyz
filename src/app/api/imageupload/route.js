export const dynamic = "force-dynamic";

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'temp');
    await mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueFilename = `${uuidv4()}.jpg`;
    const uploadPath = join(uploadDir, uniqueFilename);
    const relativePath = `/uploads/temp/${uniqueFilename}`;
    
    // Create full URL using NEXT_PUBLIC_BASE_URL
    const imagePath = `${process.env.NEXT_PUBLIC_BASE_URL}${relativePath}`;

    // Write file to disk
    await writeFile(uploadPath, buffer);

    // Return success response with full URL
    return NextResponse.json({ 
      imagePath,
      message: 'File uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}