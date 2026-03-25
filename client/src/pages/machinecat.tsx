import React, { useMemo, useState } from "react";
import { Search, Filter, ExternalLink, Wrench, Cpu, Zap, Package, Monitor, Factory } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const machineData = [
  {
    id: 1,
    shopCategory: "3D Printing",
    machineType: "FDM 3D Printer",
    manufacturer: "Prusa",
    model: "MK4",
    technology: "FDM",
    materials: ["PLA", "PETG", "ABS"],
    software: "PrusaSlicer",
    manualUrl: "https://help.prusa3d.com",
    manufacturerUrl: "https://www.prusa3d.com",
    priceRange: "$800-$1200",
    powerRequirements: "120V"
  },
  {
    id: 2,
    shopCategory: "3D Printing",
    machineType: "Resin 3D Printer",
    manufacturer: "Formlabs",
    model: "Form 4",
    technology: "SLA",
    materials: ["Standard Resin", "Tough Resin", "Castable Resin"],
    software: "PreForm",
    manualUrl: "https://support.formlabs.com",
    manufacturerUrl: "https://formlabs.com",
    priceRange: "$3500-$5000",
    powerRequirements: "120V"
  },
  {
    id: 3,
    shopCategory: "Laser",
    machineType: "CO2 Laser Cutter",
    manufacturer: "Epilog",
    model: "Fusion Pro 32",
    technology: "CO2 Laser",
    materials: ["Acrylic", "Wood", "Paper", "Leather"],
    software: "LightBurn",
    manualUrl: "https://www.epiloglaser.com/resources/",
    manufacturerUrl: "https://www.epiloglaser.com",
    priceRange: "$18k-$35k",
    powerRequirements: "220V"
  },
  {
    id: 4,
    shopCategory: "CNC",
    machineType: "CNC Router",
    manufacturer: "ShopBot",
    model: "PRSalpha",
    technology: "3-Axis CNC",
    materials: ["Wood", "Plastic", "Foam", "Aluminum"],
    software: "VCarve / Fusion 360",
    manualUrl: "https://docs.shopbottools.com",
    manufacturerUrl: "https://www.shopbottools.com",
    priceRange: "$15k-$40k",
    powerRequirements: "220V"
  },
  {
    id: 5,
    shopCategory: "CNC",
    machineType: "Desktop CNC Mill",
    manufacturer: "Bantam Tools",
    model: "Desktop CNC Milling Machine",
    technology: "CNC Milling",
    materials: ["Aluminum", "Brass", "PCB", "Wax"],
    software: "Bantam Tools Software",
    manualUrl: "https://support.bantamtools.com",
    manufacturerUrl: "https://www.bantamtools.com",
    priceRange: "$4500-$6500",
    powerRequirements: "120V"
  },
  {
    id: 6,
    shopCategory: "Electronics",
    machineType: "Soldering Station",
    manufacturer: "Weller",
    model: "WE1010",
    technology: "Hand Soldering",
    materials: ["PCB", "Wire", "Connectors"],
    software: "None",
    manualUrl: "https://www.weller-tools.com",
    manufacturerUrl: "https://www.weller-tools.com",
    priceRange: "$120-$180",
    powerRequirements: "120V"
  },
  {
    id: 7,
    shopCategory: "Textile",
    machineType: "Embroidery Machine",
    manufacturer: "Brother",
    model: "PR1055X",
    technology: "Computerized Embroidery",
    materials: ["Fabric", "Thread", "Backing"],
    software: "PE-Design",
    manualUrl: "https://support.brother.com",
    manufacturerUrl: "https://www.brother-usa.com",
    priceRange: "$8k-$14k",
    powerRequirements: "120V"
  },
  {
    id: 8,
    shopCategory: "Woodshop",
    machineType: "Table Saw",
    manufacturer: "SawStop",
    model: "Professional Cabinet Saw",
    technology: "Cabinet Saw",
    materials: ["Hardwood", "Plywood", "MDF"],
    software: "None",
    manualUrl: "https://www.sawstop.com/support/",
    manufacturerUrl: "https://www.sawstop.com",
    priceRange: "$3k-$6k",
    powerRequirements: "220V"
  },
  {
    id: 9,
    shopCategory: "Scanning",
    machineType: "3D Scanner",
    manufacturer: "Shining 3D",
    model: "EinScan HX",
    technology: "Hybrid LED + Laser",
    materials: ["Objects", "Parts", "Prototypes"],
    software: "EXScan",
    manualUrl: "https://www.shining3d.com/support/",
    manufacturerUrl: "https://www.shining3d.com",
    priceRange: "$8k-$12k",
    powerRequirements: "120V / USB"
  },
  {
    id: 10,
    shopCategory: "Robotics",
    machineType: "Robot Arm",
    manufacturer: "Universal Robots",
    model: "UR5e",
    technology: "Collaborative Robot",
    materials: ["Tooling", "End Effectors", "Fixtures"],
    software: "PolyScope",
    manualUrl: "https://www.universal-robots.com/download/",
    manufacturerUrl: "https://www.universal-robots.com",
    priceRange: "$30k-$45k",
    powerRequirements: "120V / 240V"
  },
  {
    id: 11,
    shopCategory: "Finishing",
    machineType: "Sandblaster Cabinet",
    manufacturer: "Skat Blast",
    model: "1536 Sandblasting Cabinet",
    technology: "Abrasive Blasting",
    materials: ["Metal", "Glass", "Ceramic"],
    software: "None",
    manualUrl: "https://skatblast.com",
    manufacturerUrl: "https://skatblast.com",
    priceRange: "$1.5k-$4k",
    powerRequirements: "Air + 120V"
  },
  {
    id: 12,
    shopCategory: "2D Fabrication",
    machineType: "Vinyl Cutter",
    manufacturer: "Roland",
    model: "CAMM-1 GR2",
    technology: "Drag Knife Cutting",
    materials: ["Vinyl", "Heat Transfer Vinyl", "Masking Film"],
    software: "Roland CutStudio",
    manualUrl: "https://support.rolanddga.com",
    manufacturerUrl: "https://www.rolanddga.com",
    priceRange: "$2k-$4k",
    powerRequirements: "120V"
  }
];

const categoryIcons = {
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

function StatCard({ title, value, subtitle }) {
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

function MachineCard({ machine }) {
  const Icon = categoryIcons[machine.shopCategory] || Wrench;

  return (
    <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full">{machine.shopCategory}</Badge>
            <CardTitle className="text-lg leading-tight">{machine.manufacturer} {machine.model}</CardTitle>
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
            {machine.materials.map((material) => (
              <Badge key={material} variant="outline" className="rounded-full">{material}</Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild size="sm" className="rounded-xl">
            <a href={machine.manualUrl} target="_blank" rel="noreferrer">
              Manual <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-xl">
            <a href={machine.manufacturerUrl} target="_blank" rel="noreferrer">
              Maker Site <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MakerspaceMachineCatalogue() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [powerFilter, setPowerFilter] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(machineData.map((m) => m.shopCategory)))],
    []
  );

  const filtered = useMemo(() => {
    return machineData.filter((machine) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        machine.manufacturer.toLowerCase().includes(query) ||
        machine.model.toLowerCase().includes(query) ||
        machine.machineType.toLowerCase().includes(query) ||
        machine.shopCategory.toLowerCase().includes(query) ||
        machine.technology.toLowerCase().includes(query) ||
        machine.materials.join(" ").toLowerCase().includes(query);

      const matchesCategory = category === "all" || machine.shopCategory === category;
      const matchesPower =
        powerFilter === "all" || machine.powerRequirements.toLowerCase().includes(powerFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesPower;
    });
  }, [search, category, powerFilter]);

  const totalCategories = new Set(machineData.map((m) => m.shopCategory)).size;
  const softwareCount = new Set(machineData.map((m) => m.software)).size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <Badge className="rounded-full px-3 py-1">MakerMentor Machine Catalogue</Badge>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Browse fabrication equipment in one place
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                A searchable catalogue for makerspace tools including 3D printers, CNC machines,
                laser cutters, electronics tools, textile equipment, scanners, robotics, and more.
              </p>
            </div>
          </div>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              <StatCard title="Machines" value={machineData.length} subtitle="sample catalogue" />
              <StatCard title="Categories" value={totalCategories} subtitle="shop groupings" />
              <StatCard title="Software Tools" value={softwareCount} subtitle="CAM, slicers, utilities" />
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
            <h2 className="text-xl font-semibold tracking-tight">Catalogue results</h2>
            <p className="text-sm text-slate-500">Showing {filtered.length} machines matching your filters.</p>
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
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
