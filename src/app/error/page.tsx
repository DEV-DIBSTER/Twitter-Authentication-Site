import { Suspense } from "react";
import ErrorClient from "./error-client";

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading error message...</div>}>
      <ErrorClient />
    </Suspense>
  );
}