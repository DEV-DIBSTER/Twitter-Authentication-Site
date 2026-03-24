"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ERROR_LABELS: Record<string, string> = {
  "Authorization denied": "Authorization Denied",
  "Missing parameters": "Missing Parameters",
  "Failed to exchange tokens": "Token Exchange Failed",
};

export default function ErrorClient() {
  const searchParams = useSearchParams();
  const rawMessage = searchParams.get("message") || "An unexpected error occurred.";
  const label = ERROR_LABELS[rawMessage] ?? "Something Went Wrong";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 pb-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{label}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">{rawMessage}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/api/authorize"}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
