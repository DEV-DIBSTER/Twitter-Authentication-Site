import { NextResponse } from 'next/server';
import RequestClient from '@/lib/client';

export async function GET() {
  try {

    console.log(`${process.env.SECURE_ACCESS == "true" ? process.env.SECURE_SITE_CALLBACK : process.env.UNSECURE_SITE_CALLBACK}`);

    // Generates the Authentication Link.
    const AuthLink = await RequestClient.generateAuthLink(`${process.env.SECURE_ACCESS == "true" ? process.env.SECURE_SITE_CALLBACK : process.env.UNSECURE_SITE_CALLBACK}`);

    // Stores the Oauth cookies then redirects.
    const response = NextResponse.redirect(AuthLink.url, 302);
    response.cookies.set('oauth_token', AuthLink.oauth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    response.cookies.set('oauth_token_secret', AuthLink.oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (Error) {
    console.log(Error);
    return NextResponse.json({ error: 'Failed to generate authorization link.' }, { status: 500 });
  }
}