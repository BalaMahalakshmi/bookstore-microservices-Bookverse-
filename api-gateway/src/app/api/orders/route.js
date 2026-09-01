import { NextResponse } from "next/server";

export async function POST(request) {
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

    const body = await request.json();

    const response = await fetch(
      `${process.env.ORDER_SERVICE_URL}/orders`,
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
    console.error(
      "API Gateway order POST error:",
      error
    );

    return NextResponse.json(
      {
        detail: "Order service unavailable",
      },
      {
        status: 503,
      }
    );
  }
}


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
      `${process.env.ORDER_SERVICE_URL}/orders/me`,
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
    console.error(
      "API Gateway orders GET error:",
      error
    );

    return NextResponse.json(
      {
        detail: "Order service unavailable",
      },
      {
        status: 503,
      }
    );
  }
}