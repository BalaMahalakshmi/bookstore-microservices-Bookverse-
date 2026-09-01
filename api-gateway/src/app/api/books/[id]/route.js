import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const response = await fetch(
      `${process.env.BOOK_SERVICE_URL}/books/${id}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("API Gateway book GET error:", error);

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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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
      `${process.env.BOOK_SERVICE_URL}/books/${id}`,
      {
        method: "PUT",
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
    console.error("API Gateway book PUT error:", error);

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

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
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
      `${process.env.BOOK_SERVICE_URL}/books/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("API Gateway book DELETE error:", error);

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