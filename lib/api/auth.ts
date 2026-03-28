import { apiClient } from "./client";
import { LoginInput, LoginResponse } from "@/lib/types";

export async function login(data: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/login", data);
  return response.data;
}

export async function register(formData: FormData): Promise<LoginResponse> {
  // Override the global JSON Content-Type so Axios handles the multipart boundary correctly
  const response = await apiClient.post<LoginResponse>("/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}