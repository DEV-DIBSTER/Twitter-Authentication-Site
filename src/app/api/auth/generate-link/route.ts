import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import RequestClient from "@/lib/twitter-client";
import Config from "@/config";
import { AsyncWrapOrError } from "@/lib/async-handler";

export const POST = AsyncWrapOrError(async (req: NextRequest) => {
  const { callbackUrl } = await req.json();
  
  // Generate auth link
  const link = await RequestClient.generateAuthLink(callbackUrl);

  const Cookies = await cookies();
  
  // Store tokens in cookies
  await Cookies.set("oauthToken", link.oauth_token, { 
    httpOnly: true,
    secure: Config.Secure,
    maxAge: 60 * 60, // 1 hour
  });
  
  await Cookies.set("oauthSecret", link.oauth_token_secret, { 
    httpOnly: true,
    secure: Config.Secure,
    maxAge: 60 * 60, // 1 hour
  });
  
  return NextResponse.json({ url: link.url });
});