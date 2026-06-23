import type { DashboardOverview, UserPreferences, VoiceCommandResponse } from "@/types/assistant";

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
  }
  return "http://localhost:8000/api/v1";
}

const API_BASE_URL = resolveApiBaseUrl();

type RequestOptions = {
  token?: string;
  init?: RequestInit;
};

async function request<T>(path: string, { token, init }: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export const assistantApi = {
  async login(email: string, password: string) {
    return request<{ access_token: string; token_type: string; user: Record<string, unknown> }>("/auth/login", {
      init: {
        method: "POST",
        body: JSON.stringify({ email, password })
      }
    });
  },

  async overview(token?: string) {
    return request<DashboardOverview>("/dashboard/overview", { token });
  },

  async sendCommand(text: string, token?: string) {
    return request<VoiceCommandResponse>("/assistant/commands", {
      token,
      init: {
        method: "POST",
        body: JSON.stringify({
          text,
          user_id: "demo-user",
          locale: "en-IN",
          mode: "text",
          metadata: { surface: "web-dashboard" }
        })
      }
    });
  },

  async preferences(token?: string) {
    return request<UserPreferences>("/dashboard/preferences", { token });
  },

  async savePreferences(preferences: UserPreferences, token?: string) {
    return request<UserPreferences>("/dashboard/preferences", {
      token,
      init: {
        method: "PUT",
        body: JSON.stringify(preferences)
      }
    });
  }
};
