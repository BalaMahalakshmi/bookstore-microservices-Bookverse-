import { NextResponse } from "next/server";

export async function GET(request) {
  try {
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
      `${process.env.USER_SERVICE_URL}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("API Gateway /me error:", error);

    return NextResponse.json(
      {
        detail: "User service unavailable",
      },
      {
        status: 503,
      }
    );
  }
}