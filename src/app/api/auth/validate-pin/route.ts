import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TwitterApi } from "twitter-api-v2";
import Config from "@/config";
import { AsyncWrapOrError } from "@/lib/async-handler";

export const POST = AsyncWrapOrError(async (req: NextRequest) => {
  const { pin } = await req.json();

  const Cookies = await cookies();
  
  if (!pin) {
    return NextResponse.json(
      { error: "Invalid PIN." },
      { status: 400 }
    );
  }
  
  // Get saved tokens from cookies
  const savedToken = await Cookies.get("oauthToken")?.value;
  const savedSecret = await Cookies.get("oauthSecret")?.value;
  
  if (!savedToken || !savedSecret) {
    return NextResponse.json(
      { error: "Tokens are missing from session. Please retry the auth flow." },
      { status: 400 }
    );
  }
  
  // Build a temporary client to get access token
  const TemporaryClient = new TwitterApi({
    appKey: Config.ConsumerToken,
    appSecret: Config.ConsumerSecret,
    accessToken: savedToken,
    accessSecret: savedSecret
  });
  
  try {
    // Ask for definitive access token
    const { accessToken, accessSecret, screenName, userId } = await TemporaryClient.login(pin);
    
    // Clear the temporary tokens
    await Cookies.delete("oauthToken");
    await Cookies.delete("oauthSecret");
    
    return NextResponse.json({ accessToken, accessSecret, screenName, userId });
  } catch (error) {
    console.error("Twitter PIN validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate PIN with Twitter" },
      { status: 500 }
    );
  }
});