import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Twitter Authentication</CardTitle>
          <CardDescription>
            Choose an authentication method below
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/callback-authorize">Website Based Authorization</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/pin-flow">Pin Based Authorization</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
