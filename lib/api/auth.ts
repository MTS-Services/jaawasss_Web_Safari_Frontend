import { apiClient } from "./client";
import { LoginInput, LoginResponse } from "@/lib/types";

export async function login(data: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/login", data);
  return response.data;
}
