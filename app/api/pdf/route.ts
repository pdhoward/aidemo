import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    console.log(`------made it to api pdf ----`)
  
    const directoryPath = path.join(process.cwd(), 'data/pdf');

    try {
        const files = await fs.readdir(directoryPath);
        // Filter only .pdf files
        const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

        console.log(pdfFiles)
        return NextResponse.json(pdfFiles);
    } catch(err) {
       if (err) {
        return NextResponse.json({error: err});
       } else {
        return NextResponse.json({error: 'unknown error on pdf api call'});
       }
        
    }
}

