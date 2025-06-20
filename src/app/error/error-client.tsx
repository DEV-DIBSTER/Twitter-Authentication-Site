"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorClient() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "An error occurred.";

  return (
    <div>
      <h1>Error!</h1>
      <p>{message}</p>
    </div>
  );
}