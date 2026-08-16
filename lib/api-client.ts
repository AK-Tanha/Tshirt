const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(15000),
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const errorMsg = (json as ApiErrorResponse).message;
    throw new ApiError(
      Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg,
      res.status,
    );
  }

  return (json as ApiResponse<T>).data;
}