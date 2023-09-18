import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


///////////////////////////////////////////////////////
////       simulate api call to BRTE              ////
///  fetch language, agile and test tarnslations   //
////////////////////////////////////////////////////

function removeFileExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}
function trimSpacesAndPunctuation(str: string) {
return str.trim().replace(/^[.,!?;]*|[.,!?;]*$/g, "");
}

/////////////////////////////////////////////
////  parse through the translate file    //
///     match on program, rule and arg   //
///////////////////////////////////////    

export async function POST(request: Request) {  

   let {pgm, rule, arg, comp} = await request.json() 
   pgm = removeFileExtension(pgm.toLowerCase())
   rule = rule.toLowerCase();  
   arg = arg.toLowerCase() // this is OPENAI or another named LLM - type of LLM used to gen data
   comp = comp.toLowerCase() // component is natural, drools, agile, test strategy etc

 
 const dirPath = path.join(process.cwd(), 'data', 'translate');
   console.log(dirPath)
 
 // Read all files in the directory
 const files = fs.readdirSync(dirPath); 

 for (const file of files) {
   const filePath = path.join(dirPath, file);
   const rawData = fs.readFileSync(filePath, 'utf-8');   

   try {
    const jsArray = JSON.parse(rawData);    
    
    for (const object of jsArray) {
      if (object.component === "PGM") {
        const name = trimSpacesAndPunctuation(object.name.toLowerCase());
        const program = removeFileExtension(name);
       
        if (program === pgm) {
          const foundTranslation = object.children.find(
            (child: any) => child.name.toLowerCase() === rule && child.type.toLowerCase() === arg && child.component.toLowerCase() === comp
          );
          if (foundTranslation) return NextResponse.json(foundTranslation.text);
        }
      }
    }

  } catch (error: any) {    
    return NextResponse.json(error.message);
  }

   
 } 

 return NextResponse.json("The AI NLP Service is not currently available");
};

   
