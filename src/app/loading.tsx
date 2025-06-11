import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}