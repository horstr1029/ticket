import { getArticles } from "@/lib/queries/knowledge"
import { PageHeader } from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"
import { ArticlesList } from "./articles-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function KnowledgePage() {
  const articles = await getArticles()

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        description="Help articles visible to customers in the portal"
        actions={
          <Link href="/admin/knowledge/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5 mr-1" />
            New Article
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl">
          <ArticlesList articles={articles} />
        </div>
      </main>
    </>
  )
}
