"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function CustomerSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set("q", value)
      else params.delete("q")
      router.push(`/customers?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="relative max-w-sm">
      <Search
        className="absolute left-2.5 top-2 size-3.5"
        style={{ color: "var(--rk-text3)" }}
      />
      <Input
        defaultValue={defaultValue}
        placeholder="Search customers..."
        className="h-8 pl-8 text-xs"
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  )
}
