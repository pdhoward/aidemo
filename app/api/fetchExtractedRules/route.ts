import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

//////////////////////////////////////////////////
////       simulate api call to BRTE         ////
///       fetch code for a selected rule    ////
///////////////////////////////////////////////

function removeFileExtension(filename: string) {
    return filename.replace(/\.[^/.]+$/, "");
  }
function trimSpacesAndPunctuation(str: string) {
return str.trim().replace(/^[.,!?;]*|[.,!?;]*$/g, "");
}


export async function POST(request: Request) {

  // name of the program and the rule for which extracted rule to be fetched
  
   let {pgm, rule} = await request.json() 
   let pgmWithoutExtension = removeFileExtension(pgm);
   const dirPath = path.join(process.cwd(), 'data', 'extractedrules', 'json');
   
   // Read all files in the directory
   const files = fs.readdirSync(dirPath);
 
   for (const file of files) {
     const filePath = path.join(dirPath, file);
     const rawData = fs.readFileSync(filePath, 'utf-8');
     const jsonArray = JSON.parse(rawData);
 
     for (const object of jsonArray) {        

        let name = trimSpacesAndPunctuation(object.name)
        let program = removeFileExtension(object.program)
        
       if (
         program === pgmWithoutExtension &&
         name === rule
       ) {        
         return NextResponse.json(object.paragraph)
       }
     }
   }
 
   throw new Error('Rule not found.');
 };
  
  
  

