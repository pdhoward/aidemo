import { NextResponse } from 'next/server';
import {Octokit} from '@octokit/core'
import {Base64} from 'js-base64'
import {createTokenAuth} from "@octokit/auth-token"
import data from "@/data/tree/tree.json"

//////////////////////////////////////////////////
////       simulate api call to BRTE         ////
///  fetch business rule tags for a program   //
///////////////////////////////////////////////


export async function POST(request: Request) {

  // name of the program for which business rule tags to
  // fetched

   let {name} = await request.json() 
   name = name.toLowerCase();


   let token = process.env.GITHUB_TOKEN!
   const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN })

  const auth = createTokenAuth(token);
  const authentication = await auth();
     
  const destinationUrl = 'https://github.com/pdhoward/machinecode';

  // temp url and data for testing purposes
  const brteURL =  `https://a80api.vercel.app/v1/api/brte`
  const code = `Data Division 01 Code 05 Hello World`
    
  //////////////////////////////////////
  /////   SIMULATION                ///
  ////////////////////////////////////

  // const dataObj = await fetch(brteURL, {
  //         method: 'POST',
  //         body: JSON.stringify({
  //           code: code
  //         }),
  //         headers: {
  //           'Authorization': 'Bearer ' + `123456`,
  //           'Content-Type': 'application/json'
  //       }

  // })


  //     test purposes hard coding app na,e
  let programs = data[0]['APP:CARDDEMO']

  let program = programs.find((item) => item.name.toLowerCase() === name && item.component === "PGM");
  
  if (!program) {
    program = {
      component: "not found", 
      name: name, 
      type: "undefined", 
      children: []}
  }
  //console.log(JSON.stringify(program, null, 2))
  
  return NextResponse.json(program)
  
  }
