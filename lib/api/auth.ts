import axios from "axios";
import { apiClient, publicApiClient } from "./client";
import { AuthTokenPayload, LoginInput, LoginResponse } from "@/lib/types";

export type LoginTwoFactorChallengeData = {
  two_factor?: boolean
  twoFactor?: boolean
  two_factor_token?: string
  twoFactorToken?: string
  two_factor_challenge_token?: string
  challenge_token?: string
}

export type LoginEnvelope = LoginResponse & {
  two_factor_token?: string
  twoFactorToken?: string
  data: (AuthTokenPayload & LoginTwoFactorChallengeData) | LoginTwoFactorChallengeData | null
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null
  }

  return value as Record<string, unknown>
}

export function extractTwoFactorToken(payload: unknown): string | null {
  const source = asObject(payload)
  if (!source) {
    return null
  }

  const directToken =
    source.two_factor_token ?? source.twoFactorToken ?? source.two_factor_challenge_token ?? source.challenge_token

  if (typeof directToken === "string" && directToken.trim()) {
    return directToken.trim()
  }

  const nested = asObject(source.data)
  if (!nested) {
    return null
  }

  const nestedToken =
    nested.two_factor_token ?? nested.twoFactorToken ?? nested.two_factor_challenge_token ?? nested.challenge_token

  if (typeof nestedToken === "string" && nestedToken.trim()) {
    return nestedToken.trim()
  }

  return null
}

export function isTwoFactorRequiredResponse(payload: unknown): boolean {
  if (extractTwoFactorToken(payload)) {
    return true
  }

  const source = asObject(payload)
  if (!source) {
    return false
  }

  const nested = asObject(source.data)
  if (!nested) {
    return false
  }

  return nested.two_factor === true || nested.twoFactor === true
}

export async function login(data: LoginInput): Promise<LoginEnvelope> {
  try {
    const response = await apiClient.post<LoginEnvelope>("/login", data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === "object") {
      return error.response.data as LoginEnvelope
    }
    throw error
  }
}

/** Same envelope as login; `data` may be null when manufacturer registration is pending review. */
export async function register(formData: FormData): Promise<LoginResponse> {
  // Override the global JSON Content-Type so Axios handles the multipart boundary correctly
  const response = await apiClient.post<LoginResponse>("/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export type TwoFactorChallengeInput = {
  twoFactorToken: string
  code?: string
  recoveryCode?: string
}

export async function submitTwoFactorChallenge(input: TwoFactorChallengeInput): Promise<LoginEnvelope> {
  if (!input.code?.trim() && !input.recoveryCode?.trim()) {
    throw new Error("A verification code or recovery code is required.")
  }

  try {
    const response = await publicApiClient.post<LoginEnvelope>("/two-factor-challenge", {
      two_factor_token: input.twoFactorToken,
      ...(input.code?.trim() ? { code: input.code.trim() } : {}),
      ...(input.recoveryCode?.trim() ? { recovery_code: input.recoveryCode.trim() } : {}),
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === "object") {
      return error.response.data as LoginEnvelope
    }
    throw error
  }
}

type SocialLoginEnvelope = LoginEnvelope & {
  setup_token?: string
}

export type SocialCompleteProfileInput = {
  setupToken: string
  role?: "buyer" | "manufacturer"
  companyName: string
  agreedToTerms: boolean
  city?: string
  country?: string
  companyWebsite?: string
  notes?: string
  businessLicense?: File | null
  factoryImages?: File[]
}

export async function googleTokenLogin(input: {
  token: string
  role: "buyer" | "manufacturer" | "admin"
}): Promise<SocialLoginEnvelope> {
  const response = await apiClient.post<SocialLoginEnvelope>("/auth/google/token", input)
  return response.data
}

export async function completeSocialProfile(input: SocialCompleteProfileInput): Promise<LoginResponse> {
  const form = new FormData()
  form.append("setup_token", input.setupToken)
  form.append("company_name", input.companyName)
  form.append("agreed_to_terms", input.agreedToTerms ? "1" : "0")

  if (input.role) {
    form.append("role", input.role)
  }

  if (input.city) {
    form.append("city", input.city)
  }

  if (input.country) {
    form.append("country", input.country)
  }

  if (input.companyWebsite) {
    form.append("company_website", input.companyWebsite)
  }

  if (input.notes) {
    form.append("notes", input.notes)
  }

  if (input.businessLicense) {
    form.append("business_licence", input.businessLicense)
  }

  if (input.factoryImages && input.factoryImages.length > 0) {
    input.factoryImages.forEach((file, index) => {
      form.append(`factory_images[${index}]`, file)
    })
  }

  const response = await apiClient.post<LoginResponse>("/auth/social/complete-profile", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

type PasswordActionResponse = {
  success: boolean
  message: string
}

export async function forgotPassword(email: string): Promise<PasswordActionResponse> {
  const response = await publicApiClient.post<PasswordActionResponse>("/forgot-password", {
    email,
  })
  return response.data
}

export type ResetPasswordInput = {
  otp: string
  email: string
  password: string
  passwordConfirmation: string
}

export async function resetPassword(input: ResetPasswordInput): Promise<PasswordActionResponse> {
  const response = await publicApiClient.post<PasswordActionResponse>("/reset-password", {
    otp: input.otp,
    email: input.email,
    password: input.password,
    password_confirmation: input.passwordConfirmation,
  })
  return response.data
}