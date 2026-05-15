"use server"

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"

export type LoginState = { error?: string } | undefined

export async function logout() {
  await signOut({ redirectTo: "/login" })
}

export async function login(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    throw error
  }
}
