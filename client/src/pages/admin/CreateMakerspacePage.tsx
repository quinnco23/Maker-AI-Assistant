import * as React from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Building2, ImagePlus, MapPin, Globe, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type MakerspaceFormValues = {
  name: string;
  slug: string;
  location: string;
  description: string;
  website: string;
  logoFile: File | null;
};

type MakerspaceFormErrors = Partial<Record<keyof MakerspaceFormValues, string>>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function validateForm(values: MakerspaceFormValues): MakerspaceFormErrors {
  const errors: MakerspaceFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Makerspace name is required.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Public URL slug is required.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }

  if (!values.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.trim().length < 20) {
    errors.description = "Please add a little more detail.";
  }

  if (values.website.trim()) {
    try {
      new URL(values.website);
    } catch {
      errors.website = "Enter a valid full URL, like https://example.com";
    }
  }

  return errors;
}

function StepProgress() {
  const steps = ["Welcome", "Makerspace", "Machine", "Certification", "Review", "Invite"];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isComplete = index === 0;
        const isCurrent = index === 1;

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

export default function CreateMakerspacePage() {
  const [, setLocation] = useLocation();

  const [values, setValues] = React.useState<MakerspaceFormValues>({
    name: "",
    slug: "",
    location: "",
    description: "",
    website: "",
    logoFile: null,
  });

  const [errors, setErrors] = React.useState<MakerspaceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string>("");

  const slugWasEditedRef = React.useRef(false);

  React.useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  function updateField<K extends keyof MakerspaceFormValues>(
    key: K,
    value: MakerspaceFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextName = e.target.value;
    setValues((prev) => ({
      ...prev,
      name: nextName,
      slug: slugWasEditedRef.current ? prev.slug : slugify(nextName),
    }));

    if (errors.name || errors.slug) {
      setErrors((prev) => ({
        ...prev,
        name: undefined,
        slug: undefined,
      }));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    slugWasEditedRef.current = true;
    updateField("slug", slugify(e.target.value));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    updateField("logoFile", file);

    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
      setLogoPreviewUrl("");
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(objectUrl);
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

      // Replace this with your real API call later.
      // Example:
      // const formData = new FormData();
      // formData.append("name", values.name);
      // formData.append("slug", values.slug);
      // formData.append("location", values.location);
      // formData.append("description", values.description);
      // formData.append("website", values.website);
      // if (values.logoFile) formData.append("logo", values.logoFile);
      //
      // const res = await fetch("/api/makerspaces", {
      //   method: "POST",
      //   body: formData,
      //   credentials: "include",
      // });
      //
      // if (!res.ok) throw new Error("Failed to create makerspace");

      localStorage.setItem(
        "makerspace_onboarding",
        JSON.stringify({
          makerspace: {
            name: values.name,
            slug: values.slug,
            location: values.location,
            description: values.description,
            website: values.website,
          },
        }),
      );

      setLocation("/app/admin/onboarding/machine");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const publicUrlPreview = values.slug
    ? `yourapp.com/spaces/${values.slug}`
    : "yourapp.com/spaces/your-space";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/app/admin/onboarding"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to onboarding
            </Link>

            <StepProgress />
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            Step 1 of 5
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">Create your makerspace</CardTitle>
              <CardDescription className="text-base">
                Add the basics for your public profile and internal setup.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Makerspace name</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      value={values.name}
                      onChange={handleNameChange}
                      placeholder="Downtown Innovation Lab"
                      className="pl-9"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Public URL</Label>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500">yourapp.com/spaces/</span>
                      <input
                        id="slug"
                        value={values.slug}
                        onChange={handleSlugChange}
                        placeholder="downtown-innovation-lab"
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                  {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="location"
                      value={values.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Salinas, CA"
                      className="pl-9"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="relative">
                    <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      id="description"
                      value={values.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Tell members what your makerspace offers, who it serves, and what kinds of tools or programs are available."
                      className="min-h-[140px] pl-9"
                    />
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    value={values.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://example.org"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600">{errors.website}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="logo">Logo (optional)</Label>

                  <label
                    htmlFor="logo"
                    className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:bg-slate-100"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <ImagePlus className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Upload logo</p>
                      <p className="text-sm text-slate-500">
                        PNG, JPG, or SVG for your makerspace profile
                      </p>
                    </div>
                  </label>

                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  {logoPreviewUrl && (
                    <div className="rounded-2xl border bg-white p-4">
                      <p className="mb-3 text-sm font-medium text-slate-700">Logo preview</p>
                      <img
                        src={logoPreviewUrl}
                        alt="Makerspace logo preview"
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-xl px-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Continue to machines"}
                  </Button>

                  <Button asChild variant="outline" size="lg" className="rounded-xl px-6">
                    <Link href="/app/admin/onboarding">Cancel</Link>
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
                  This is how your makerspace setup will read at a glance.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                    {logoPreviewUrl ? (
                      <img
                        src={logoPreviewUrl}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-7 w-7 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-semibold text-slate-900">
                      {values.name || "Your Makerspace Name"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{values.location || "Your location"}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {values.description || "A short description of your makerspace will appear here."}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Public URL
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-900">
                    {publicUrlPreview}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>What comes next</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Next step: add your first machine</p>
                  <p className="mt-1">
                    You’ll add equipment like a Prusa MK4S, laser cutter, CNC router, or other shop tools.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Then attach certification</p>
                  <p className="mt-1">
                    Assign a training template or create a custom certification flow for that machine.
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