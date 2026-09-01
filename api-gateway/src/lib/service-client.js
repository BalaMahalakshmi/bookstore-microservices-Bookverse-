export async function callService(
  url,
  options = {}
) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return {
      response,
      data,
    };
  } catch (error) {
    console.error("Service communication error:", error);

    throw new Error("Service unavailable");
  }
}