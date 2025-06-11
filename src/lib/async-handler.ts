import { NextRequest, NextResponse } from "next/server";

type AsyncHandler = (
  req: NextRequest,
  params?: { params: Record<string, string> }
) => Promise<NextResponse>;

export function AsyncWrapOrError(handler: AsyncHandler) {
  return async (req: NextRequest, params?: { params: Record<string, string> }) => {
    try {
      return await handler(req, params);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };
}