import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as { role?: string })?.role

      // Public paths — no auth required
      if (
        pathname === "/login" ||
        pathname.startsWith("/widget") ||
        pathname.startsWith("/api/widget") ||
        pathname.startsWith("/api/webhooks")
      ) {
        return true
      }

      if (!isLoggedIn) return false

      // Customers can only access /portal and /
      if (role === "customer" && !pathname.startsWith("/portal") && pathname !== "/") {
        return Response.redirect(new URL("/portal", nextUrl))
      }

      return true
    },
  },
  providers: [],
}
