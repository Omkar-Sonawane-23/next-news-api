import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "./lib/utils";
import express from 'express';

const app = express();


const isStaticPath = (path: string) => {
  return path.startsWith("/_next") || path.startsWith("/favicon.ico");
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow from all origins
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

export async function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  const country = request.geo?.country ?? "Country";

  if (isStaticPath(requestPath)) {
    return NextResponse.next();
  }

  if (requestPath.startsWith("/api")) {
    // TODO: implement rate limiting
    const isRatelimited = false;
    if (isRatelimited) {
      return NextResponse.json(
        {
          error: "Too many requests, please try again later.",
        },
        { status: 429 }
      );
    }
  }

  const clientIp = getClientIp(request);
  console.log(`${request.method} ${clientIp} (${country}) -> ${requestPath}`);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/:path*"],
};
