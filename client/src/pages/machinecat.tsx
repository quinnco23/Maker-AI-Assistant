import { useMemo, useState, useEffect,  } from "react";
import {
  Search,
  Filter,
  ExternalLink,
  Wrench,
  Cpu,
  Zap,
  Package,
  Monitor,
  Factory,
  
} from "lucide-react";

import { Link } from "wouter";
import rawMachines from "@/data/makerspace_equipment_database.json";

import { Card, CardContent, CardHeader, CardTitle,  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button,  } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  

} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type Machine = {
  id: number;
  shopCategory: string;
  machineType: string;
  manufacturer: string;
  model: string;
  technology: string;
  materials: string[];
  software: string;
  manualUrl: string;
  manufacturerUrl: string;
  priceRange: string;
  powerRequirements: string;
};




const machineData = rawMachines.map((m, i) => ({
  id: m.id || i + 1,
  shopCategory: m.shopCategory,
  machineType: m.machineType,
  manufacturer: m.manufacturer,
  model: m.model,
  technology: m.technologyClass,
  materials: m.typicalMaterialsSupported || [],
  software: m.softwareUsed || "N/A",
  manualUrl: m.manualDocumentationUrl,
  manufacturerUrl: m.manufacturerUrl,
  priceRange: m.estimatedPriceRangeUsd,
  powerRequirements: m.typicalPowerRequirement,
}));


const categoryIcons: Record<string, React.ElementType> = {
  "3D Printing": Package,
  CNC: Factory,
  Laser: Zap,
  Electronics: Cpu,
  Textile: Wrench,
  Woodshop: Wrench,
  Scanning: Monitor,
  Robotics: Cpu,
  Finishing: Wrench,
  "2D Fabrication": Filter,
};




function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number | string;
  subtitle: string;
}) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function MachineCard({
  machine,
  onAddToMakerspace,
  isAdded,
  isSaving,
}: {
  machine: Machine;
  onAddToMakerspace: (machine: Machine) => void;
  isAdded?: boolean;
  isSaving?: boolean;
}) {
  const Icon = categoryIcons[machine.shopCategory] || Wrench;

  return (
    <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full">
              {machine.shopCategory}
            </Badge>
            <CardTitle className="text-lg leading-tight">
              {machine.manufacturer} {machine.model}
            </CardTitle>
            <div className="text-sm text-slate-500">{machine.machineType}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-slate-500">Technology</div>
            <div className="font-medium">{machine.technology}</div>
          </div>
          <div>
            <div className="text-slate-500">Power</div>
            <div className="font-medium">{machine.powerRequirements}</div>
          </div>
          <div>
            <div className="text-slate-500">Software</div>
            <div className="font-medium">{machine.software}</div>
          </div>
          <div>
            <div className="text-slate-500">Price</div>
            <div className="font-medium">{machine.priceRange}</div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm text-slate-500">Materials</div>
          <div className="flex flex-wrap gap-2">
            {(machine.materials || []).map((material) => (
              <Badge key={material} variant="outline" className="rounded-full">
                {material}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild size="sm" className="rounded-xl">
            <a href={machine.manualUrl} target="_blank" rel="noreferrer">
              Manual
            </a>
          </Button>

          <Button asChild size="sm" variant="outline" className="rounded-xl">
            <a href={machine.manufacturerUrl} target="_blank" rel="noreferrer">
              Maker Site
            </a>
          </Button>

          <Button
  size="sm"
  variant={isAdded ? "secondary" : "default"}
  className="rounded-xl"
  onClick={() => onAddToMakerspace(machine)}
  disabled={isAdded || isSaving}
>
  {isAdded ? "Added" : isSaving ? "Adding..." : "Add to Makerspace"}
</Button>
<Link  href={`/app/admin/machines/${machine.id}/certification`}>
  Manage Certification
</Link>

        </div>
      </CardContent>
    </Card>
  );
}

export default function MakerspaceMachineCatalogue() {


  const [search, setSearch] = useState("");
const [category, setCategory] = useState("all");
const [powerFilter, setPowerFilter] = useState("all");
const [addedMachineIds, setAddedMachineIds] = useState<number[]>([]);
const [isSavingMachine, setIsSavingMachine] = useState<number | null>(null);

useEffect(() => {
  async function loadAdminMachines() {
    try {
      const res = await fetch("/api/admin/makerspace", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load admin makerspace");
      }

      const data = await res.json();

      const matchedIds = (data.machines || [])
        .map((savedMachine: any) => savedMachine.catalogSourceId)
        .filter((id: number | undefined) => typeof id === "number");

      setAddedMachineIds(matchedIds);
    } catch (error) {
      console.error("Failed to load admin machines:", error);
    }
  }

  loadAdminMachines();
}, []);

async function handleAddToMakerspace(machine: Machine) {
  if (addedMachineIds.includes(machine.id)) return;

  try {
    setIsSavingMachine(machine.id);

    const payload = {
      name: `${machine.manufacturer} ${machine.model}`,
      type: machine.shopCategory,
      brand: machine.manufacturer,
      model: machine.model,
      locationLabel: "Main Floor",
      description: `${machine.machineType} using ${machine.technology}`,
      requiresCertification: true,
      imageUrl: "",
      catalogSourceId: machine.id,
    };

    const res = await fetch("/api/admin/machines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("POST /api/admin/machines status:", res.status);
    console.log("POST /api/admin/machines response:", text);

    if (!res.ok) {
      throw new Error(`Failed to add machine: ${res.status}`);
    }

    const data = JSON.parse(text);
    console.log("saved machine:", data.machine);

    setAddedMachineIds((prev) =>
      prev.includes(machine.id) ? prev : [...prev, machine.id]
    );
  } catch (error) {
    console.error("Failed to add machine:", error);
  } finally {
    setIsSavingMachine(null);
  }
}

  const categories = useMemo(
    () => ["all", ...Array.from(new Set((machineData as Machine[]).map((m) => m.shopCategory)))],
    []
  );

  const filtered = useMemo(() => {
    return (machineData as Machine[]).filter((machine) => {
      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        machine.manufacturer.toLowerCase().includes(query) ||
        machine.model.toLowerCase().includes(query) ||
        machine.machineType.toLowerCase().includes(query) ||
        machine.shopCategory.toLowerCase().includes(query) ||
        machine.technology.toLowerCase().includes(query) ||
        machine.materials.join(" ").toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || machine.shopCategory === category;

      const matchesPower =
        powerFilter === "all" ||
        machine.powerRequirements.toLowerCase().includes(powerFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesPower;
    });
  }, [search, category, powerFilter]);

  const totalCategories = new Set((machineData as Machine[]).map((m) => m.shopCategory)).size;
  const softwareCount = new Set((machineData as Machine[]).map((m) => m.software)).size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1">
              MakerMentor Machine Catalogue
            </Badge>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Browse fabrication equipment in one place
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                A searchable catalogue for makerspace tools including 3D printers,
                CNC machines, laser cutters, electronics tools, textile equipment,
                scanners, robotics, and more.
              </p>
            </div>
          </div>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              <StatCard
                title="Machines"
                value={(machineData as Machine[]).length}
                subtitle="catalogue entries"
              />
              <StatCard
                title="Categories"
                value={totalCategories}
                subtitle="shop groupings"
              />
              <StatCard
                title="Software Tools"
                value={softwareCount}
                subtitle="CAM, slicers, utilities"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardContent className="grid gap-4 p-5 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search machine, model, material, technology..."
                className="h-11 rounded-xl pl-10"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item === "all" ? "All categories" : item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={powerFilter} onValueChange={setPowerFilter}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Filter by power" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All power types</SelectItem>
                <SelectItem value="120v">120V</SelectItem>
                <SelectItem value="220v">220V</SelectItem>
                <SelectItem value="usb">USB</SelectItem>
                <SelectItem value="air">Air-assisted</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Catalogue results
            </h2>
            <p className="text-sm text-slate-500">
              Showing {filtered.length} machines matching your filters.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setPowerFilter("all");
            }}
          >
            Reset filters
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((machine) => (
  <MachineCard
    key={machine.id}
    machine={machine}
    onAddToMakerspace={handleAddToMakerspace}
    isAdded={addedMachineIds.includes(machine.id)}
    isSaving={isSavingMachine === machine.id}
  />
))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}