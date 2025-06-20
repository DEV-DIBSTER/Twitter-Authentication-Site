"use client";

import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || "";
  const profileImageUrl = searchParams.get('profile_image_url') || "";
  const accessToken = searchParams.get('accessToken') || "";
  const accessSecret = searchParams.get('accessSecret') || "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex items-center flex-col gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <CardTitle className="text-center">Authentication Successful</CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Here is your authenticated session info.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Username</p>
            <p className="text-base font-semibold">{username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Access Token</p>
            <p className="break-all text-base font-mono text-green-600">{accessToken}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Access Secret</p>
            <p className="break-all text-base font-mono text-blue-600">{accessSecret}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}