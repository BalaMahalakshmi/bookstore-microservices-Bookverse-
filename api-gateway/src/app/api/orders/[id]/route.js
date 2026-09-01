import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const authorization =
      request.headers.get("authorization");

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
      `${process.env.ORDER_SERVICE_URL}/orders/${id}`,
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
      "API Gateway order GET error:",
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