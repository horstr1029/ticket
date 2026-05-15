"use client"

import { useActionState } from "react"
import { submitWidgetTicket } from "@/lib/actions/widget"
import { CheckCircle, Loader2 } from "lucide-react"

export default function WidgetPage() {
  const [state, action, pending] = useActionState(submitWidgetTicket, undefined)

  if (state && "success" in state && state.success) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px",
          textAlign: "center",
          background: "#f8fafc",
        }}
      >
        <CheckCircle size={48} color="#10d98a" />
        <h2 style={{ marginTop: 16, marginBottom: 8, fontSize: 18, fontWeight: 700, color: "#1a2332" }}>
          We got your message!
        </h2>
        <p style={{ color: "#5a7a9a", fontSize: 14, margin: 0 }}>
          {state && "success" in state && `Ticket #${state.ticketNumber} has been created.`} We&apos;ll be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px 20px",
      }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a2332", marginBottom: 4 }}>
          Contact Support
        </h2>
        <p style={{ fontSize: 13, color: "#5a7a9a", marginBottom: 20 }}>
          We&apos;ll get back to you as soon as possible.
        </p>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              name="name"
              required
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              Email <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              Subject <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              name="subject"
              required
              placeholder="Brief description of your issue"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              Message <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              name="body"
              required
              placeholder="Describe your issue in detail..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
          </div>

          {state && "error" in state && (
            <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              background: "#00c2ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {pending && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {pending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 14,
  color: "#1a2332",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
}
