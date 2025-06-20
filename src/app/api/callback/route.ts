import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');
    const denied = searchParams.get('denied');

    if (denied) {
      console.log('Authorization denied');
      return NextResponse.redirect('http://127.0.0.1:3000/error?message=Authorization%20denied', 302);
    }

    // Get oauth_token_secret from cookie
    const oauth_token_secret = (await (await cookies()).get('oauth_token_secret'))?.value;

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
      console.log('Missing parameters', { oauth_token, oauth_verifier, oauth_token_secret });
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // This creates the new client from the tokens.
    const client = new TwitterApi({
      appKey: process.env.CONSUMER_KEY!,
      appSecret: process.env.CONSUMER_SECRET!,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret
    });

    // Exchange the request token for an access token
    const { accessToken, accessSecret } = await client.login(oauth_verifier);
    
    console.log('Access Token:', accessToken);
    console.log('Access Secret:', accessSecret);

    // Create a new client with the access token and secret
    const userClient = new TwitterApi({
      appKey: process.env.CONSUMER_KEY!,
      appSecret: process.env.CONSUMER_SECRET!,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    // Get the user's profile
    const user = await userClient.v2.me({ "user.fields": ['profile_image_url', 'username'] });

    // Clear cookies
    await (await cookies()).delete('oauth_token');
    await (await cookies()).delete('oauth_token_secret');

    // Redirect the user to a success page with the user's information
    const redirectUrl = new URL('http://127.0.0.1:3000/success');
    redirectUrl.searchParams.set('username', user.data.username);
    redirectUrl.searchParams.set('profile_image_url', user.data.profile_image_url || ''); // Handle potential null value
    redirectUrl.searchParams.set('accessToken', accessToken);
    redirectUrl.searchParams.set('accessSecret', accessSecret);

    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to exchange tokens' }, { status: 500 });
  }
}