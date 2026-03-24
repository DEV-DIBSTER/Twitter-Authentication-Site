"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, CheckCircle2, Copy, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </Button>
  );
}

function TokenField({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  const [visible, setVisible] = useState(false);

  if (!value) {
    return (
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm italic text-destructive">Not provided</p>
      </div>
    );
  }

  const masked = "•".repeat(Math.min(value.length, 32));

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className={`break-all text-sm font-mono ${colorClass} flex-1 min-w-0`}>
          {visible ? value : masked}
        </p>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide" : "Show"}
          >
            {visible ? (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
          <CopyButton value={value} />
        </div>
      </div>
    </div>
  );
}

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const profileImageUrl = searchParams.get("profile_image_url") || "";
  const accessToken = searchParams.get("accessToken") || "";
  const accessSecret = searchParams.get("accessSecret") || "";

  const isMissingData = !username || !accessToken || !accessSecret;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex items-center flex-col gap-4 text-center">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profileImageUrl || undefined} alt={username || "User"} />
              <AvatarFallback className="text-2xl">
                {username ? username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {!isMissingData && (
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 ring-2 ring-background">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-xl">
              {username ? `@${username}` : "Authentication Successful"}
            </CardTitle>
            <CardDescription className="mt-1">
              {isMissingData
                ? "Some session data is missing. Please try authorizing again."
                : "Your authenticated session credentials are shown below."}
            </CardDescription>
          </div>
        </CardHeader>

        {isMissingData ? (
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              One or more required fields were not returned by the authorization flow. This may
              indicate a configuration issue or a cancelled authorization.
            </div>
          </CardContent>
        ) : (
          <CardContent className="space-y-4">
            <TokenField label="Username" value={username} colorClass="text-foreground font-semibold" />
            <TokenField label="Access Token" value={accessToken} colorClass="text-green-600 dark:text-green-400" />
            <TokenField label="Access Secret" value={accessSecret} colorClass="text-blue-600 dark:text-blue-400" />
          </CardContent>
        )}

        {isMissingData && (
          <CardFooter className="justify-center">
            <Button onClick={() => (window.location.href = "/api/authorize")}>
              Try Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
