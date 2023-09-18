import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
   
  // rewrite for users starting at /home and selecting begin button
  if (path == `/beginthejourney`) {
     // Check if the environment is development or production
    if (process.env.NODE_ENV === 'development') {
      // Redirect to app.localhost:3000 in development
      return NextResponse.redirect('http://process.localhost:3000');
    } else {
      // Redirect to `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` in production
      return NextResponse.redirect(`https://process.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
    }
  }

  // rewrites for process steps
  if (hostname == `process.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    
    return NextResponse.rewrite(
      new URL(`/process${path === "/" ? "" : path}`, req.url),
    );
  }  
  
  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === `www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  ) {    
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
 return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
