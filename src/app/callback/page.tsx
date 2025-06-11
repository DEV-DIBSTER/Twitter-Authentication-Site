"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthResult {
  accessToken: string;
  accessSecret: string;
  userId: string;
  screenName: string;
}

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        setIsLoading(true);
        const oauthToken = searchParams.get("oauth_token");
        const oauthVerifier = searchParams.get("oauth_verifier");

        if (!oauthToken || !oauthVerifier) {
          setError("Bad request, or you denied application access. Please renew your request.");
          return;
        }

        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oauthToken, oauthVerifier }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to complete authentication");
        }

        const data = await response.json();
        setAuthResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    processCallback();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Processing...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">{error}</p>
            <Button asChild className="w-full">
              <Link href="/">Go Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Congratulations!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">
            You are successfully logged into Twitter using your application. Here are your account tokens below. Don&apos;t share these!
          </p>
          <div className="space-y-2 p-4 bg-muted rounded-md">
            <p><strong>Access token:</strong> {authResult?.accessToken}</p>
            <p><strong>Access secret:</strong> {authResult?.accessSecret}</p>
            <p><strong>User ID:</strong> {authResult?.userId}</p>
            <p><strong>Username:</strong> @{authResult?.screenName}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}