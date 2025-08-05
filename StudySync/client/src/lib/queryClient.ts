import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { firebaseApi } from "./api-client";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Route Firebase API calls
  if (method === 'POST' && url === '/api/progress') {
    return { json: async () => firebaseApi.updateProgress(data as any) } as Response;
  }
  
  if (method === 'POST' && url === '/api/daily-study') {
    return { json: async () => firebaseApi.updateDailyStudy(data as any) } as Response;
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const [endpoint, ...params] = queryKey as string[];
    
    // Route Firebase API calls
    if (endpoint === '/api/users') {
      return firebaseApi.getAllUsers() as any;
    }
    
    if (endpoint === '/api/progress' && params.length === 1) {
      return firebaseApi.getProgress(params[0]) as any;
    }
    
    if (endpoint === '/api/daily-study' && params.length === 2) {
      return firebaseApi.getDailyStudy(params[0], params[1]) as any;
    }

    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
