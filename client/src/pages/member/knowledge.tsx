import * as React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function MemberKnowledgePage() {
  const [articles, setArticles] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    async function load() {
      const res = await fetch("/api/member/knowledge", {
        credentials: "include",
      });
      const json = await res.json();
      setArticles(json.articles || []);
    }
    load();
  }, []);

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Knowledge Base</h1>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guides, fixes, materials..."
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((article) => (
          <Card key={article.id} className="rounded-2xl">
            <CardContent className="p-5">
              <h3 className="font-semibold">{article.title}</h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                {article.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}