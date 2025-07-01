import { z } from "zod";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

export class FetchError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

export async function fetchWithError<T>(
  path: string,
  options: FetchOptions = {},
  schema?: z.ZodType<T>,
): Promise<T> {
  const { params, ...restOptions } = options;

  // Add query params if they exist
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  const fullUrl = `${process.env.API_URL}${path}${queryString}`;

  const response = await fetch(fullUrl, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...restOptions.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new FetchError(
      response.status,
      data.message || "An error occurred",
      data,
    );
  }

  if (schema) {
    return schema.parse(data);
  }

  return data as T;
}
