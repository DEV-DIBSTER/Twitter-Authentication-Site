import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center">The page you are looking for does not exist.</p>
          <Button asChild className="w-full">
            <Link href="/">Go Back Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}