import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);

    const response = await fetch(
      `${process.env.BOOK_SERVICE_URL}/books?${url.searchParams.toString()}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("API Gateway books GET error:", error);

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

export async function POST(request) {
  try {
    const body = await request.json();
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          detail: "Authorization header required",
        },
        {
          status: 401,
        }
      );
    }

    const response = await fetch(
      `${process.env.BOOK_SERVICE_URL}/books`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("API Gateway books POST error:", error);

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