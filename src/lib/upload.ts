import { promises as fs } from 'fs';
import path from 'path';

/**
 * Utility to save an uploaded file to the public directory.
 * @param file The File object from FormData
 * @param subDir The subdirectory within public/ (e.g., 'books', 'pfp')
 * @param prefix Optional prefix for the filename
 * @returns The public URL of the saved file
 */
export async function savePublicFile(file: File, subDir: string, prefix: string = ''): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
  const filename = `${prefix}${prefix ? '-' : ''}${Date.now()}-${sanitizedName}`;
  const uploadDir = path.join(process.cwd(), "public", subDir);
  
  // Ensure the directory exists
  await fs.mkdir(uploadDir, { recursive: true });
  
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  
  return `/${subDir}/${filename}`;
}
