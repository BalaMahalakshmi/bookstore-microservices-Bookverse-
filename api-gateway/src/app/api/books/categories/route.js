import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.BOOK_SERVICE_URL}/books/categories`
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("API Gateway categories error:", error);

    return NextResponse.json(
      {
        detail: "Book service unavailable",
      },
      {
        status: 503,
      }
    );
  }
}