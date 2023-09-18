import { NextResponse } from 'next/server';
import fs from 'fs/promises'; // Use promises for async file operations
import path from 'path';

////////////////////////////////////////////
//// simulate db call for translate obj ///
//////////////////////////////////////////

async function removeFileExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

async function trimSpacesAndPunctuation(str: string) {
  return str.trim().replace(/^[.,!?;]*|[.,!?;]*$/g, "");
}

export async function POST(request: Request) {
  try {
    let { pgm, rule, arg, comp } = await request.json();
    pgm = await removeFileExtension(pgm.toLowerCase());
    rule = rule.toLowerCase();
    arg = arg.toLowerCase();
    comp = comp.toLowerCase();

    const dirPath = path.join(process.cwd(), 'data', 'translate');
    let files: string[];

    try {
      files = await fs.readdir(dirPath);
    } catch (error: any) {
      return NextResponse.json({ error: `Could not read directory: ${error.message}` });
    }

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      let rawData: string;

      try {
        rawData = await fs.readFile(filePath, 'utf-8');
      } catch (error: any) {
        return NextResponse.json({ error: `Could not read file ${file}: ${error.message}` });
      }

      try {
        const jsArray = JSON.parse(rawData);

        for (const object of jsArray) {
          if (object.component === "PGM") {
            const name = await trimSpacesAndPunctuation(object.name.toLowerCase());
            const program = await removeFileExtension(name);

            if (program === pgm) {
              return NextResponse.json(object);
            }
          }
        }
      } catch (error: any) {
        return NextResponse.json({ error: `Error parsing JSON in file ${file}: ${error.message}` });
      }
    }

    return NextResponse.json({ error: `No matching program found for ${pgm}` });

  } catch (error: any) {
    return NextResponse.json({ error: `An unexpected error occurred: ${error.message}` });
  }
}

