import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DirectoryMakerspace = {
  id: string;
  name: string;
  slug: string;
  location?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  machineCount?: number;
  memberCount?: number;
};

export default function DiscoverMakerspacesPage() {
  const [makerspaces, setMakerspaces] = useState<DirectoryMakerspace[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMakerspaces() {
      try {
        const res = await fetch("/api/makerspaces/discover", {
          credentials: "include",
        });

        const json = await res.json();
        console.log("discover makerspaces response:", json);

        if (!res.ok) {
          throw new Error(json.message || "Failed to load makerspaces");
        }

        setMakerspaces(json.makerspaces ?? []);
      } catch (error) {
        console.error("Failed to load makerspaces:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMakerspaces();
  }, []);

  const filteredMakerspaces = useMemo(() => {
    const normalized = query.toLowerCase().trim();

    if (!normalized) return makerspaces;

    return makerspaces.filter((space) =>
      [space.name, space.location, space.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [makerspaces, query]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Makerspace Directory
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">
              Join a makerspace
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Browse makerspaces, explore available equipment, and join a space
              to start earning machine certifications.
            </p>
          </div>

          <Link href="/signup">
            <Button variant="outline" className="rounded-xl">
              Create a Makerspace
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, or description..."
            className="w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-slate-400"
          />
        </div>

        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-sm text-slate-500 shadow-sm">
            Loading makerspaces...
          </div>
        ) : filteredMakerspaces.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-white p-8 text-center text-sm text-slate-500">
            No makerspaces found.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredMakerspaces.map((space) => (
              <MakerspaceDirectoryCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MakerspaceDirectoryCard({
  space,
}: {
  space: DirectoryMakerspace;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          {space.logoUrl ? (
            <img
              src={space.logoUrl}
              alt={space.name}
              className="h-12 w-12 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
              {space.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-950">
              {space.name}
            </h2>

            {space.location && (
              <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {space.location}
              </div>
            )}
          </div>
        </div>

        <p className="line-clamp-3 text-sm text-slate-600">
          {space.description || "Explore machines, certifications, and member resources."}
        </p>

        <div className="flex gap-2 text-xs text-slate-600">
          <div className="rounded-full bg-slate-100 px-3 py-1">
            {space.machineCount ?? 0} machines
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1">
            {space.memberCount ?? 0} members
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/join/${space.slug}`}>
            <Button className="rounded-xl">
              Join
            </Button>
          </Link>

          <Link href={`/join/${space.slug}`}>
            <Button variant="outline" className="rounded-xl">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}