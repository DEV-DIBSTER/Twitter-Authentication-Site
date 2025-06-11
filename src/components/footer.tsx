import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  return (
    <Card className="w-full border-t rounded-none">
      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
        <div className="text-sm text-muted-foreground mb-2">
          © 2020 - {new Date().getFullYear()} DIBSTER
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://dibster.dev" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
            Privacy Policy
          </a>
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  );
}