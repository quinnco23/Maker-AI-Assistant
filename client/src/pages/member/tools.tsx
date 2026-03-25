import { Link } from "wouter";
// import { Crosshair, Printer, Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
 //import prusaQr from "./prus_qr.png"

const tools = [
  // {
  //   id: "laser",
  //   name: "Laser Cutter",
  //   category: "Fabrication",
  //   icon: Crosshair,
  //   description: "High-precision CO2 laser cutting and engraving. Supports wood, acrylic, leather, and more.",
  //   available: true,
  // },
   {
     id: "Prusa MK4S 3D Printer",
     name: "Prusa MK4S 3D Printer",
     category: "Additive Manufacturing",
    // icon: Printer,
    description: "FDM and resin 3D printers for prototyping and production parts.",
    available: true,
    image: "https://www.prusa3d.com/cdn-cgi/image/width=1024,format=auto,quality=85/content/images/product/7ee2b138-29c0-4ab4-94d1-7bac57740356.jpg",
   },
  // {
  //   id: "electronics",
  //   name: "Electronics Workbench",
  //   category: "Electronics",
  //   icon: Cpu,
  //   description: "Soldering stations, oscilloscopes, and component libraries for electronics projects.",
  //   available: false,
  // },
];

export default function MemberTools() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tools Library</h1>
        <p className="text-muted-foreground mt-1">
          Browse available equipment, manuals, and safety documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover-elevate flex flex-col" data-testid={`card-tool-${tool.id}`}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className=" h-13 w-13">
                  {/* <tool.icon className="h-5 w-5" /> */}

                  <img
  src={tool.image}
  alt={tool.name}
  className="w-75 h-20 object-cover rounded"
/>
                </div>
                {!tool.available && (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
              <div>
                <CardTitle className="text-base">{tool.name}</CardTitle>
                <CardDescription className="text-xs mt-1">{tool.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </CardContent>
            <CardFooter>
              {tool.available ? (
                <Link href={`/app/member/tools/${tool.id}`}>
                  <Button variant="outline" data-testid={`button-view-${tool.id}`}>
                    View Details
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled data-testid={`button-view-${tool.id}`}>
                  View Details
                </Button>
              )}

{/* <img
  src="/prusa_qr.png"
  alt="Machine QR Code"
  className="w-20 h-20"
 
/>  */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
