import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TwitterApi } from "twitter-api-v2";
import Config from "@/config";
import { AsyncWrapOrError } from "@/lib/async-handler";

export const POST = AsyncWrapOrError(async (req: NextRequest) => {

  const Cookies = await cookies();

  const { oauthToken, oauthVerifier } = await req.json();
  
  // Get saved tokens from cookies
  const savedToken = await Cookies.get("oauthToken")?.value;
  const savedSecret = await Cookies.get("oauthSecret")?.value;
  
  if (!savedToken || !savedSecret || savedToken !== oauthToken) {
    return NextResponse.json(
      { error: "OAuth token is not known or invalid. Your request may have expired. Please renew the auth process." },
      { status: 400 }
    );
  }
  
  // Build a temporary client to get access token
  const TemporaryClient = new TwitterApi({
    appKey: Config.ConsumerToken,
    appSecret: Config.ConsumerSecret,
    accessToken: oauthToken,
    accessSecret: savedSecret
  });
  
  try {
    // Ask for definitive access token
    const { accessToken, accessSecret, screenName, userId } = await TemporaryClient.login(oauthVerifier);
    
    const Cookies = await cookies();

    // Clear the temporary tokens
    await Cookies.delete("oauthToken");
    await Cookies.delete("oauthSecret");
    
    return NextResponse.json({ accessToken, accessSecret, screenName, userId });
  } catch (error) {
    console.error("Twitter login error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate with Twitter" },
      { status: 500 }
    );
  }
});