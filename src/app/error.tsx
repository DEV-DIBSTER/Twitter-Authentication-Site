'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">Unexpected error has occurred!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center">Please alert site Administrators of this issue!</p>
          <div className="flex flex-col gap-2">
            <Button onClick={reset} variant="outline" className="w-full">
              Try Again
            </Button>
            <Button asChild className="w-full">
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}