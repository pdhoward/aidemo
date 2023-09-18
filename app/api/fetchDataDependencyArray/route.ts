import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

//////////////////////////////////////////////////
////       simulate api call to backend      ////
///       fetch dependency array for files  ////
///////////////////////////////////////////////

function removeFileExtension(filename: string) {
    return filename.replace(/\.[^/.]+$/, "");
  }
function trimSpacesAndPunctuation(str: string) {
return str.trim().replace(/^[.,!?;]*|[.,!?;]*$/g, "");
}

export async function POST(request: Request) {
  // name of the program and the rule for which extracted rule to be fetched
  
   let {pgm } = await request.json() 
   let pgmWithoutExtension = removeFileExtension(pgm);
   const dirPath = path.join(process.cwd(), 'data', 'datadependency');
   
   // Read only json file from the directory
   try {

      const [file] = fs.readdirSync(dirPath);
      const filePath = path.join(dirPath, file);
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const jsonArray = JSON.parse(rawData);       

      return NextResponse.json(jsonArray)

   } catch(error) {
      throw new Error('Dependency Array not found.');
   }     
 };
  
  
  

