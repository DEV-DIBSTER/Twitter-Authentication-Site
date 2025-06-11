"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Link from "next/link";

const pinSchema = z.object({
  pin: z.string().min(1, "PIN is required").regex(/^\d+$/, "PIN must contain only numbers")
});

type PinFormValues = z.infer<typeof pinSchema>;

interface AuthResult {
  accessToken: string;
  accessSecret: string;
  userId: string;
  screenName: string;
}

export default function PinFlowPage() {
  const [step, setStep] = useState<"initial" | "pin" | "result">("initial");
  const [authLink, setAuthLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);

  const form = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    const generateAuthLink = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/generate-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ callbackUrl: "oob" }),
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

  const onSubmit = async (values: PinFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/validate-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: values.pin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to validate PIN");
      }

      const data = await response.json();
      setAuthResult(data);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthLinkClick = () => {
    setStep("pin");
  };

  if (isLoading && step === "initial") {
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

  if (step === "initial") {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Pin Based Authorization</CardTitle>
            <CardDescription>
              Click the button below to start the authorization process
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full"
              onClick={handleAuthLinkClick}
            >
              <a href={authLink} target="_blank" rel="noopener noreferrer">
                Click Here to Start!
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "pin") {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Enter PIN</CardTitle>
            <CardDescription>
              Enter the PIN provided by Twitter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Enter PIN here..." 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Validating..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "result" && authResult) {
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
              <p><strong>Access token:</strong> {authResult.accessToken}</p>
              <p><strong>Access secret:</strong> {authResult.accessSecret}</p>
              <p><strong>User ID:</strong> {authResult.userId}</p>
              <p><strong>Username:</strong> @{authResult.screenName}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}