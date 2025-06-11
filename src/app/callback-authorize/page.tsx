"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Config from "@/config";
import Link from "next/link";

export default function CallbackAuthorizePage() {
  const [authLink, setAuthLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const generateAuthLink = async () => {
      try {
        setIsLoading(true);
        const callbackUrl = `${Config.Secure ? "https" : "http"}://${Config.Secure ? Config.SiteURL : `127.0.0.1:${Config.Port}`}/callback`;
        
        const response = await fetch("/api/auth/generate-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ callbackUrl }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate authentication link");
        }

        const data = await response.json();
        setAuthLink(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    generateAuthLink();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Loading...</CardTitle>
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
          <CardTitle className="text-2xl">Website Based Authorization</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button asChild size="lg" className="w-full">
            <a href={authLink} target="_blank" rel="noopener noreferrer">
              Authorize with Twitter
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}