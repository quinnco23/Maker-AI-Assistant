import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  Wrench,
  MapPin,
  ShieldCheck,
  Camera,
  Cpu,
  Cog,
  Printer,
  ScanLine,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MachineType =
  | "3d_printer"
  | "laser_cutter"
  | "cnc_router"
  | "vinyl_cutter"
  | "electronics"
  | "woodshop"
  | "other";

type MachineFormValues = {
  name: string;
  type: MachineType | "";
  brand: string;
  model: string;
  locationLabel: string;
  description: string;
  imageFile: File | null;
  requiresCertification: boolean;
};

type MachineFormErrors = Partial<Record<keyof MachineFormValues, string>>;

const machineTypeOptions: {
  value: MachineType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "3d_printer",
    label: "3D Printer",
    icon: <Printer className="h-4 w-4" />,
  },
  {
    value: "laser_cutter",
    label: "Laser Cutter",
    icon: <ScanLine className="h-4 w-4" />,
  },
  {
    value: "cnc_router",
    label: "CNC Router",
    icon: <Cog className="h-4 w-4" />,
  },
  {
    value: "vinyl_cutter",
    label: "Vinyl Cutter",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    value: "electronics",
    label: "Electronics Station",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    value: "woodshop",
    label: "Woodshop Tool",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    value: "other",
    label: "Other",
    icon: <Wrench className="h-4 w-4" />,
  },
];

function validateForm(values: MachineFormValues): MachineFormErrors {
  const errors: MachineFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Machine name is required.";
  }

  if (!values.type) {
    errors.type = "Please choose a machine type.";
  }

  if (!values.locationLabel.trim()) {
    errors.locationLabel = "Location in the makerspace is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Add a short description for this machine.";
  } else if (values.description.trim().length < 12) {
    errors.description = "Please add a little more detail.";
  }

  return errors;
}

function StepProgress() {
  const steps = ["Welcome", "Makerspace", "Machine", "Certification", "Review", "Invite"];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isComplete = index <= 1;
        const isCurrent = index === 2;

        return (
          <div
            key={step}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium",
              isCurrent
                ? "bg-slate-900 text-white"
                : isComplete
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}

function getTypeLabel(type: MachineType | "") {
  return machineTypeOptions.find((option) => option.value === type)?.label ?? "Machine type";
}

export default function CreateMachinePage() {
  const [, setLocation] = useLocation();

  const [values, setValues] = React.useState<MachineFormValues>({
    name: "",
    type: "3d_printer",
    brand: "",
    model: "",
    locationLabel: "",
    description: "",
    imageFile: null,
    requiresCertification: true,
  });

  const [errors, setErrors] = React.useState<MachineFormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState("");

  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  function updateField<K extends keyof MachineFormValues>(
    key: K,
    value: MachineFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    updateField("imageFile", file);

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl("");
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const existingRaw = localStorage.getItem("makerspace_onboarding");
      const existing = existingRaw ? JSON.parse(existingRaw) : {};

      localStorage.setItem(
        "makerspace_onboarding",
        JSON.stringify({
          ...existing,
          machine: {
            name: values.name,
            type: values.type,
            brand: values.brand,
            model: values.model,
            locationLabel: values.locationLabel,
            description: values.description,
            requiresCertification: values.requiresCertification,
          },
        }),
      );

      setLocation("/app/admin/onboarding/certification");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/app/admin/onboarding/makerspace"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to makerspace
            </Link>

            <StepProgress />
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            Step 2 of 5
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">Add your first machine</CardTitle>
              <CardDescription className="text-base">
                Start with one machine users will discover, learn, and certify on.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Machine name</Label>
                  <Input
                    id="name"
                    value={values.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Prusa MK4S"
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                  <Label>Machine type</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {machineTypeOptions.map((option) => {
                      const selected = values.type === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField("type", option.value)}
                          className={[
                            "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
                            selected
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              selected ? "bg-white/15" : "bg-slate-100",
                            ].join(" ")}
                          >
                            {option.icon}
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={values.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                      placeholder="Prusa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={values.model}
                      onChange={(e) => updateField("model", e.target.value)}
                      placeholder="MK4S"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationLabel">Location in space</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="locationLabel"
                      value={values.locationLabel}
                      onChange={(e) => updateField("locationLabel", e.target.value)}
                      placeholder="Back Room - Station 3"
                      className="pl-9"
                    />
                  </div>
                  {errors.locationLabel && (
                    <p className="text-sm text-red-600">{errors.locationLabel}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short description</Label>
                  <Input
                    id="description"
                    value={values.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Reliable FDM printer for PLA and PETG beginner workflows."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="image">Machine image (optional)</Label>

                  <label
                    htmlFor="image"
                    className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:bg-slate-100"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <Camera className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Upload machine photo</p>
                      <p className="text-sm text-slate-500">
                        A photo helps members recognize equipment quickly
                      </p>
                    </div>
                  </label>

                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreviewUrl && (
                    <div className="rounded-2xl border bg-white p-4">
                      <p className="mb-3 text-sm font-medium text-slate-700">Image preview</p>
                      <img
                        src={imagePreviewUrl}
                        alt="Machine preview"
                        className="h-36 w-full rounded-xl object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Requires certification?</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => updateField("requiresCertification", true)}
                      className={[
                        "rounded-2xl border p-4 text-left transition",
                        values.requiresCertification
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        Yes, certification required
                      </div>
                      <p
                        className={[
                          "mt-2 text-sm",
                          values.requiresCertification ? "text-slate-200" : "text-slate-600",
                        ].join(" ")}
                      >
                        Members must complete training before using this machine.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateField("requiresCertification", false)}
                      className={[
                        "rounded-2xl border p-4 text-left transition",
                        !values.requiresCertification
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <Wrench className="h-4 w-4" />
                        No, open access
                      </div>
                      <p
                        className={[
                          "mt-2 text-sm",
                          !values.requiresCertification ? "text-slate-200" : "text-slate-600",
                        ].join(" ")}
                      >
                        Members can view the machine and use it without certification.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-xl px-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Continue to certification"}
                  </Button>

                  <Button asChild variant="outline" size="lg" className="rounded-xl px-6">
                    <Link href="/app/admin/onboarding/makerspace">Back</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Live preview</CardTitle>
                <CardDescription>
                  This is how your machine will appear during setup.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-2xl border bg-white">
                  <div className="flex h-48 items-center justify-center bg-slate-100">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Machine preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="h-10 w-10 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {values.name || "Your machine name"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {getTypeLabel(values.type)}
                      </p>
                    </div>

                    <div className="text-sm text-slate-600">
                      {values.brand || values.model
                        ? [values.brand, values.model].filter(Boolean).join(" ")
                        : "Brand and model will appear here"}
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                      {values.description || "Machine description will appear here."}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Location</span>
                      <span className="font-medium text-slate-900">
                        {values.locationLabel || "Not set"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Certification</span>
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          values.requiresCertification
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800",
                        ].join(" ")}
                      >
                        {values.requiresCertification ? "Required" : "Optional"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>What comes next</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Attach certification</p>
                  <p className="mt-1">
                    Choose a machine certification template or start building one.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Publish your setup</p>
                  <p className="mt-1">
                    Review your makerspace and machine details before going live.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}