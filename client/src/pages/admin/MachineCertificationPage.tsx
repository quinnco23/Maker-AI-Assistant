import * as React from "react";
import { Link, useLocation, useRoute  } from "wouter";
import { ArrowLeft, ShieldCheck, Wrench } from "lucide-react";
import { useState } from "react";
import { getTemplate } from "../../features/certifications/templates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


import { Input } from "@/components/ui/input";
//  import { prusaMk4sCertificationModule } from "@/features/certifications/data/prusa-mk4s";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



type CertificationTemplate = {
  id: string;
  title: string;
  description: string;
  machineTypes: string[];
  estimatedMinutes: number;
  passingScore: number;
  levelsCount: number;
  tags: string[];
};

type MachineCertificationProgram = {
  id: string;
  machineId: string;
  title: string;
  description?: string;
  version: string;
  sourceType: "template" | "duplicate" | "custom";
  sourceTemplateId?: string;
  status: "draft" | "published" | "archived";
  passingScore: number;
  estimatedMinutes: number;
  expiresInDays?: number | null;
  isRequired: boolean;
  contentJson?: unknown;
  createdAt: string;
  updatedAt: string;
};

type PageData = {
  machine: {
    id: string;
    name: string;
    type: string;
    brand?: string;
    model?: string;
    locationLabel: string;
    requiresCertification: boolean;
  };
  activeProgram: MachineCertificationProgram | null;
  templates: CertificationTemplate[];
};

function validateCertification(module: any) {
  const errors: string[] = [];

  if (!module?.title?.trim()) {
    errors.push("Add a certification title.");
  }

  if (!module?.levels?.length) {
    errors.push("Add at least one certification step.");
  }

  module?.levels?.forEach((level: any, index: number) => {
    const label = `Step ${index + 1}: ${level.title || "Untitled"}`;

    if (!level.title?.trim()) {
      errors.push(`${label} needs a title.`);
    }

    if (level.type === "lesson") {
      if (!level.narrative?.some((p: string) => p.trim())) {
        errors.push(`${label} needs lesson content.`);
      }
    }

    const choices = level.choices ?? level.options ?? [];

if (level.type === "scenario") {
  if (!level.prompt?.trim()) {
    errors.push(`${label} needs a scenario prompt.`);
  }

  if (choices.length < 2) {
    errors.push(`${label} needs at least two choices.`);
  }

  if (!choices.some((choice: any) => choice.isCorrect === true || choice.correct === true)) {
    errors.push(`${label} needs one correct choice.`);
  }

  choices.forEach((choice: any, choiceIndex: number) => {
    if (!choice.label?.trim()) {
      errors.push(`${label} choice ${choiceIndex + 1} needs text.`);
    }
  });
}

if (level.type === "quick_check") {
  if (!level.questions?.length) {
    errors.push(`${label} needs at least one question.`);
  }

  level.questions?.forEach((question: any, questionIndex: number) => {
    const qLabel = `${label}, question ${questionIndex + 1}`;

    const prompt = question.prompt ?? question.question ?? "";
    const choices = question.choices ?? question.answers ?? [];

    if (!prompt.trim()) {
      errors.push(`${qLabel} needs a question prompt.`);
    }

    if (choices.length < 2) {
      errors.push(`${qLabel} needs at least two choices.`);
    }

    if (!choices.some((choice: any) => choice.isCorrect === true || choice.correct === true)) {
      errors.push(`${qLabel} needs one correct answer.`);
    }

    choices.forEach((choice: any, choiceIndex: number) => {
      if (!choice.label?.trim()) {
        errors.push(`${qLabel}, choice ${choiceIndex + 1} needs text.`);
      }
    });
  });
}
  });

  return errors;
}

export default function MachineCertificationPage() {
  const [, params] = useRoute("/app/admin/machines/:machineId/certification");
  const machineId = params?.machineId;

  const [data, setData] = React.useState<PageData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [sourceType, setSourceType] = React.useState<"template" | "duplicate" | "custom">("template");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [passingScore, setPassingScore] = React.useState(80);
  const [estimatedMinutes, setEstimatedMinutes] = React.useState(8);
  const [expiresInDays, setExpiresInDays] = React.useState<number | "">(365);
  const [isRequired, setIsRequired] = React.useState(true);
  const [editorState, setEditorState] = useState<any | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  

  React.useEffect(() => {
    async function loadPage() {
      try {
        setIsLoading(true);
  
        const res = await fetch(`/api/admin/machines/${machineId}/certification`, {
          credentials: "include",
        });
  
        const text = await res.text();
        console.log("cert settings status:", res.status);
        console.log("cert settings raw response:", text);
  
        if (!res.ok) {
          throw new Error(`Failed to load certification page: ${res.status}`);
        }
  
        const json = JSON.parse(text);
        console.log("cert settings parsed json:", json);
  
        setData(json);
  
        if (json.activeProgram) {
          setSourceType(json.activeProgram.sourceType ?? "template");
          setSelectedTemplateId(json.activeProgram.sourceTemplateId || "");
          setTitle(json.activeProgram.title || "");
          setDescription(json.activeProgram.description || "");
          setPassingScore(json.activeProgram.passingScore || 80);
          setEstimatedMinutes(json.activeProgram.estimatedMinutes || 8);
          setExpiresInDays(json.activeProgram.expiresInDays ?? "");
          setIsRequired(!!json.activeProgram.isRequired);
          setEditorState(
            json.activeProgram?.contentJson
              ? JSON.parse(JSON.stringify(json.activeProgram.contentJson))
              : null,
          );
        }
      } catch (error) {
        console.error("Failed to load machine certification page:", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    if (machineId) {
      loadPage();
    }
  }, [machineId]);

  const selectedTemplate = data?.templates.find((t) => t.id === selectedTemplateId) ?? null;

  async function handleSaveDraft() {
    if (!machineId) return;
  
    try {
      setIsSaving(true);
  
      const payload = {
        sourceType,
        sourceTemplateId: selectedTemplateId || undefined,
        title,
        description,
        passingScore,
        estimatedMinutes,
        expiresInDays: expiresInDays === "" ? null : Number(expiresInDays),
        isRequired,
        status: "draft",
        contentJson: editorState,
      };
  
      console.log("Saving draft payload:", payload);
  
      const res = await fetch(`/api/admin/machines/${machineId}/certification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      const text = await res.text();
      console.log("Save draft status:", res.status);
      console.log("Save draft response:", text);
  
      if (!res.ok) {
        throw new Error("Failed to save certification");
      }
  
      const json = JSON.parse(text);
      setData((prev) =>
        prev
          ? {
              ...prev,
              activeProgram: json.program,
            }
          : prev,
      );

      setEditorState(json.program.contentJson ?? editorState);
setSaveMessage("Draft saved");

setTimeout(() => {
  setSaveMessage("");
}, 3000);


    } catch (error) {
      console.error("Failed to save certification:", error);
    } finally {
      setIsSaving(false);
    }
  }
  async function handlePublish() {
    if (!machineId) return;
    const errors = validateCertification({
  ...editorState,
  title,
  passingScore,
  estimatedMinutes,
});

if (errors.length > 0) {
  setValidationErrors(errors);
  setSaveMessage("Complete your certification before publishing.");
  return;
}

setValidationErrors([]);
  
    try {
      setIsSaving(true);
  
      const payload = {
        sourceType,
        sourceTemplateId: selectedTemplateId || undefined,
        title,
        description,
        passingScore,
        estimatedMinutes,
        expiresInDays: expiresInDays === "" ? null : Number(expiresInDays),
        isRequired,
        status: "published",
        contentJson: editorState,
      };
  
      console.log("Publishing cert payload:", payload);
  
      const res = await fetch(`/api/admin/machines/${machineId}/certification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      const text = await res.text();
      console.log("Publish status:", res.status);
      console.log("Publish response:", text);
  
      if (!res.ok) {
        throw new Error("Failed to publish certification");
      }
  
      const json = JSON.parse(text);
      setData((prev) =>
        prev
          ? {
              ...prev,
              activeProgram: json.program,
            }
          : prev,
      );

      setEditorState(json.program.contentJson ?? editorState);
setSaveMessage("Published");

setTimeout(() => {
  setSaveMessage("");
}, 3000);
    } catch (error) {
      console.error("Failed to publish certification:", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-7xl p-6">Loading certification editor...</div>;
  }

  if (!data) {
    return <div className="mx-auto max-w-7xl p-6">Could not load certification settings.</div>;
  }


  function updateLevel(index: number, updates: Record<string, any>) {
    setEditorState((prev: any) =>
      prev
        ? {
            ...prev,
            levels: (prev.levels ?? []).map((level: any, i: number) =>
              i === index ? { ...level, ...updates } : level,
            ),
          }
        : prev,
    );
  }
  
  function moveLevel(index: number, direction: "up" | "down") {
    setEditorState((prev: any) => {
      if (!prev?.levels) return prev;
  
      const nextLevels = [...prev.levels];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
  
      if (targetIndex < 0 || targetIndex >= nextLevels.length) return prev;
  
      const [moved] = nextLevels.splice(index, 1);
      nextLevels.splice(targetIndex, 0, moved);
  
      return {
        ...prev,
        levels: nextLevels,
      };
    });
  }

  const summaryTitle = editorState?.title ?? title ?? "Untitled";
  const summaryLevelCount = editorState?.levels?.length ?? 0;
  const summaryPassingScore = editorState?.passingScore ?? passingScore;
  const summaryEstimatedMinutes =
  editorState?.estimatedMinutes ?? estimatedMinutes;

const summaryStatus = data.activeProgram?.status ?? "Not created";

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <Link
        href={`/app/admin/machines/${data.machine.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to machine
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            <Wrench className="h-4 w-4" />
            {data.machine.name}
          </div>

          <div className="space-y-4">
  <h2 className="text-lg font-semibold">Choose Certification Type</h2>

  
</div>

          <p className="mt-2 text-slate-600">
            Configure the training members must complete to operate this machine.
          </p>
        </div>
      </div>
      {validationErrors.length > 0 && (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
    <div className="font-semibold">
      Complete your certification before publishing
    </div>

    <ul className="mt-2 list-disc space-y-1 pl-5">
      {validationErrors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  </div>
)}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
 
        <div className="space-y-6">
          
        <Card>
  <CardHeader>
    <CardTitle>Certification Source</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">

    {/* 👇 TOP ROW: MODE BUTTONS */}
    <div className="grid gap-4 md:grid-cols-3 p-25">

      {/* Use Template */}
      <button className="bg-primary p-2 rounded-xl text-white "
        //style={{background:"blue"}}
        type="button"
        onClick={() => {
          setSourceType("template");
          setSelectedTemplateId("");
        }}
      >
        Use Template
      </button>

      {/* Duplicate */}
      {/* <button  className="bg-primary p-2 rounded-xl text-white "
        type="button"
        onClick={() => {
          setSourceType("duplicate");
          setSelectedTemplateId("");

          if (data?.activeProgram?.contentJson) {
            setEditorState(
              JSON.parse(JSON.stringify(data.activeProgram.contentJson))
            );
          }
        }}
      >
        Duplicate Existing
      </button> */}

      {/* Custom */}
      <button className="bg-primary p-2 rounded-xl text-white "
        type="button"
        onClick={() => {
          setSourceType("custom");
          setSelectedTemplateId("");
          setEditorState({
            id: "new-cert",
            title: "New Certification",
            version: "1.0.0",
            passingScore: 80,
            estimatedMinutes: 10,
            levels: [],
          });
        }}
      >
        Start from Scratch
      </button>

    </div>

    {/* 👇 THIS IS WHERE YOUR BLOCK GOES */}
    {sourceType === "template" && (
  <div className="space-y-3 pt-2">
    <div className="text-sm font-medium text-slate-700">
      Template Library
    </div>

    <Select
      value={selectedTemplateId ?? ""}
      onValueChange={(templateId) => {
        setSelectedTemplateId(templateId);

        const template = data?.templates?.find(
          (t: any) => t.id === templateId,
        );

        const templateContent = getTemplate(templateId);

        if (templateContent) {
          setEditorState(
            JSON.parse(JSON.stringify(templateContent)),
          );
        }

        if (template) {
          setTitle(template.title);
          setDescription(template.description);
          setPassingScore(template.passingScore);
          setEstimatedMinutes(template.estimatedMinutes);
        }
      }}
    >
      <SelectTrigger className="w-full rounded-xl">
        <SelectValue placeholder="Select a certification template" />
      </SelectTrigger>

      <SelectContent>
        {data?.templates?.map((template: any) => (
          <SelectItem
            key={template.id}
            value={template.id}
          >
            {template.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {selectedTemplateId && (
      <div className="rounded-2xl border bg-slate-50 p-4">
        {(() => {
          const template = data?.templates?.find(
            (t: any) => t.id === selectedTemplateId,
          );

          if (!template) return null;

          return (
            <>
              <div className="font-semibold text-slate-900">
                {template.title}
              </div>

              <div className="mt-1 text-sm text-slate-600">
                {template.description}
              </div>

              <div className="mt-2 text-xs text-slate-500">
                {template.estimatedMinutes} min •{" "}
                {template.passingScore}% pass
              </div>
            </>
          );
        })()}
      </div>
    )}
  </div>
)}

  </CardContent>
</Card>
<Card className="rounded-3xl border-0 shadow-sm">
  <CardHeader>
    <CardTitle>Certification Content Editor</CardTitle>
    <CardDescription>
      Review and edit the certification structure before saving.
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    {!editorState ? (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        Select a template, duplicate an existing certification, or start from scratch.
      </div>
    ) : (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Content Title
            </label>
            <input
              value={editorState.title ?? ""}
              onChange={(e) =>
                setEditorState((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        title: e.target.value,
                      }
                    : prev
                )
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Content Version
            </label>
            <input
              value={editorState.version ?? ""}
              onChange={(e) =>
                setEditorState((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        version: e.target.value,
                      }
                    : prev
                )
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Content Passing Score
            </label>
            <input
              type="number"
              value={editorState.passingScore ?? 80}
              onChange={(e) =>
                setEditorState((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        passingScore: Number(e.target.value),
                      }
                    : prev
                )
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Content Estimated Minutes
            </label>
            <input
              type="number"
              value={editorState.estimatedMinutes ?? 10}
              onChange={(e) =>
                setEditorState((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        estimatedMinutes: Number(e.target.value),
                      }
                    : prev
                )
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-900">
            Levels ({editorState.levels?.length ?? 0})
          </div>

          <div className="mt-3 space-y-2">
          {(editorState.levels ?? []).map((level: any, index: number) => (
  <div
    key={level.id ?? index}
    className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-2">
        <input
          value={level.title ?? ""}
          onChange={(e) => updateLevel(index, { title: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
          placeholder={`Level ${index + 1} title`}
        />

        <input
          value={level.shortTitle ?? ""}
          onChange={(e) => updateLevel(index, { shortTitle: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600"
          placeholder="Short label"
        />

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            Type: {level.type || "unknown"}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-500">
            XP
            <input
              type="number"
              value={level.xp ?? 0}
              onChange={(e) => updateLevel(index, { xp: Number(e.target.value) })}
              className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs"
            />
          </label>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={index === 0}
          onClick={() => moveLevel(index, "up")}
        >
          Up
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={index === (editorState.levels?.length ?? 1) - 1}
          onClick={() => moveLevel(index, "down")}
        >
          Down
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
          onClick={() => {
            setEditorState((prev: any) =>
              prev
                ? {
                    ...prev,
                    levels: (prev.levels ?? []).filter(
                      (_: any, i: number) => i !== index,
                    ),
                  }
                : prev,
            );
          }}
        >
          Delete
        </Button>
      </div>
    </div>

    {level.type === "lesson" && (
      <div className="rounded-xl bg-slate-50 p-4">
        <div className="mb-3 text-sm font-medium text-slate-900">
          Lesson Narrative
        </div>



        <div className="space-y-3">
          {(level.narrative ?? []).map((paragraph: string, paragraphIndex: number) => (
            <div key={paragraphIndex} className="flex gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => {
                  const nextNarrative = [...(level.narrative ?? [])];
                  nextNarrative[paragraphIndex] = e.target.value;
                  updateLevel(index, { narrative: nextNarrative });
                }}
                className="min-h-[80px] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Lesson paragraph"
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  const nextNarrative = (level.narrative ?? []).filter(
                    (_: string, i: number) => i !== paragraphIndex,
                  );
                  updateLevel(index, { narrative: nextNarrative });
                }}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              updateLevel(index, {
                narrative: [...(level.narrative ?? []), ""],
              })
            }
          >
            Add Paragraph
          </Button>
        </div>

        <div className="space-y-2 rounded-xl bg-sky-50 p-4">
  <div className="text-sm font-medium text-sky-900">
    Callouts / How It Works
  </div>

  {(level.callouts ?? []).map((item: string, calloutIndex: number) => (
    <div key={calloutIndex} className="flex gap-2">
      <input
        value={item}
        onChange={(e) => {
          const nextCallouts = [...(level.callouts ?? [])];
          nextCallouts[calloutIndex] = e.target.value;

          updateLevel(index, {
            callouts: nextCallouts,
          });
        }}
        className="flex-1 rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm"
        placeholder="Example: Keep hands clear of moving parts"
      />

      <button
        type="button"
        onClick={() => {
          const nextCallouts = (level.callouts ?? []).filter(
            (_: string, i: number) => i !== calloutIndex,
          );

          updateLevel(index, {
            callouts: nextCallouts,
          });
        }}
        className="rounded-lg border border-sky-200 px-3 py-2 text-sm text-sky-800 hover:bg-sky-100"
      >
        Delete
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() => {
      updateLevel(index, {
        callouts: [
          ...(level.callouts ?? []),
          "New callout",
        ],
      });
    }}
    className="rounded-lg border border-sky-200 px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100"
  >
    Add Callout
  </button>
</div>

<div className="space-y-2 rounded-xl bg-emerald-50 p-4">
  <div className="text-sm font-medium text-emerald-900">
    Key Takeaways / Certification Objectives
  </div>

  {(level.keyTakeaways ?? []).map((item: string, takeawayIndex: number) => (
    <div key={takeawayIndex} className="flex gap-2">
      <input
        value={item}
        onChange={(e) => {
          const nextTakeaways = [...(level.keyTakeaways ?? [])];
          nextTakeaways[takeawayIndex] = e.target.value;

          updateLevel(index, {
            keyTakeaways: nextTakeaways,
          });
        }}
        className="flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
        placeholder="Example: Verify material is secured before starting"
      />

      <button
        type="button"
        onClick={() => {
          const nextTakeaways = (level.keyTakeaways ?? []).filter(
            (_: string, i: number) => i !== takeawayIndex,
          );

          updateLevel(index, {
            keyTakeaways: nextTakeaways,
          });
        }}
        className="rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-800 hover:bg-emerald-100"
      >
        Delete
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() => {
      updateLevel(index, {
        keyTakeaways: [
          ...(level.keyTakeaways ?? []),
          "New certification objective",
        ],
      });
    }}
    className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
  >
    Add Takeaway
  </button>
</div>
      </div>
    )}

    {level.type === "scenario" && (
      <div className="rounded-xl bg-slate-50 p-4">
        <div className="mb-3 text-sm font-medium text-slate-900">
          Scenerio Builder
        </div>

        <div className="space-y-3">
          <textarea
            value={level.situation ?? ""}
            onChange={(e) => updateLevel(index, { situation: e.target.value })}
            className="min-h-[70px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Situation/context"
          />

          <textarea
            value={level.prompt ?? ""}
            onChange={(e) => updateLevel(index, { prompt: e.target.value })}
            className="min-h-[70px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Scenario prompt/question"
          />

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Choices
            </div>

            {(level.choices ?? []).map((choice: any, choiceIndex: number) => (
              <div
                key={choice.id ?? choiceIndex}
                className="space-y-2 rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={choice.label ?? ""}
                    onChange={(e) => {
                      const nextChoices = [...(level.choices ?? [])];
                      nextChoices[choiceIndex] = {
                        ...choice,
                        label: e.target.value,
                      };
                      updateLevel(index, { choices: nextChoices });
                    }}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Choice text"
                  />

                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={!!(choice.isCorrect ?? choice.correct)}
                      onChange={(e) => {
                        const nextChoices = [...(level.choices ?? [])];
                        nextChoices[choiceIndex] = {
                          ...choice,
                          isCorrect: e.target.checked,
                          correct: e.target.checked,
                        };
                        updateLevel(index, { choices: nextChoices });
                      }}
                    />
                    Correct
                  </label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      const nextChoices = (level.choices ?? []).filter(
                        (_: any, i: number) => i !== choiceIndex,
                      );
                      updateLevel(index, { choices: nextChoices });
                    }}
                  >
                    Delete
                  </Button>
                </div>

                <textarea
                  value={choice.feedback ?? choice.explanation ?? ""}
                  onChange={(e) => {
                    const nextChoices = [...(level.choices ?? [])];
                    nextChoices[choiceIndex] = {
                      ...choice,
                      feedback: e.target.value,
                      explanation: e.target.value,
                    };
                    updateLevel(index, { choices: nextChoices });
                  }}
                  className="min-h-[60px] w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                  placeholder="Feedback shown after selection"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                updateLevel(index, {
                  choices: [
                    ...(level.choices ?? []),
                    {
                      id: `choice-${Date.now()}`,
                      label: "New choice",
                      isCorrect: false,
                      correct: false,
                      feedback: "",
                    },
                  ],
                })
              }
            >
              Add Choice
            </Button>
          </div>
        </div>
      </div>
    )}

{level.type === "quick_check" && (
  <div className="rounded-xl bg-slate-50 p-4">
    <div className="mb-3 text-sm font-medium text-slate-900">
      Multiple Choice Quiz Builder
    </div>

    <div className="space-y-4">
      {(level.questions ?? []).map((question: any, questionIndex: number) => (
        <div
          key={question.id ?? questionIndex}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Question
              </label>

              <textarea
                value={question.question ?? ""}
                onChange={(e) => {
                  const nextQuestions = [...(level.questions ?? [])];

                  nextQuestions[questionIndex] = {
                    ...question,
                    question: e.target.value,
                  };

                  updateLevel(index, { questions: nextQuestions });
                }}
                className="min-h-[70px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Enter quiz question"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => {
                const nextQuestions = (level.questions ?? []).filter(
                  (_: any, i: number) => i !== questionIndex,
                );

                updateLevel(index, { questions: nextQuestions });
              }}
            >
              Delete Question
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Answers
            </div>

            {(question.answers ?? []).map((answer: any, answerIndex: number) => (
              <div
                key={answer.id ?? answerIndex}
                className="flex items-center gap-2"
              >
                <input
                  value={answer.label ?? ""}
                  onChange={(e) => {
                    const nextQuestions = [...(level.questions ?? [])];
                    const nextAnswers = [...(question.answers ?? [])];

                    nextAnswers[answerIndex] = {
                      ...answer,
                      label: e.target.value,
                    };

                    nextQuestions[questionIndex] = {
                      ...question,
                      answers: nextAnswers,
                    };

                    updateLevel(index, { questions: nextQuestions });
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Answer option"
                />

                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!answer.correct}
                    onChange={(e) => {
                      const nextQuestions = [...(level.questions ?? [])];
                      const nextAnswers = [...(question.answers ?? [])];

                      nextAnswers[answerIndex] = {
                        ...answer,
                        correct: e.target.checked,
                      };

                      nextQuestions[questionIndex] = {
                        ...question,
                        answers: nextAnswers,
                      };

                      updateLevel(index, { questions: nextQuestions });
                    }}
                  />
                  Correct
                </label>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    const nextQuestions = [...(level.questions ?? [])];

                    const nextAnswers = (question.answers ?? []).filter(
                      (_: any, i: number) => i !== answerIndex,
                    );

                    nextQuestions[questionIndex] = {
                      ...question,
                      answers: nextAnswers,
                    };

                    updateLevel(index, { questions: nextQuestions });
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const nextQuestions = [...(level.questions ?? [])];
                const nextAnswers = [
                  ...(question.answers ?? []),
                  {
                    id: `answer-${Date.now()}`,
                    label: "New answer",
                    correct: false,
                  },
                ];

                nextQuestions[questionIndex] = {
                  ...question,
                  answers: nextAnswers,
                };

                updateLevel(index, { questions: nextQuestions });
              }}
            >
              Add Answer
            </Button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Explanation
            </label>

            <textarea
              value={question.explanation ?? ""}
              onChange={(e) => {
                const nextQuestions = [...(level.questions ?? [])];

                nextQuestions[questionIndex] = {
                  ...question,
                  explanation: e.target.value,
                };

                updateLevel(index, { questions: nextQuestions });
              }}
              className="min-h-[60px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              placeholder="Explain the correct answer"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateLevel(index, {
            questions: [
              ...(level.questions ?? []),
              {
                id: `question-${Date.now()}`,
                question: "New quiz question",
                answers: [
                  {
                    id: `answer-${Date.now()}-a`,
                    label: "Correct answer",
                    correct: true,
                  },
                  {
                    id: `answer-${Date.now()}-b`,
                    label: "Incorrect answer",
                    correct: false,
                  },
                ],
                explanation: "",
              },
            ],
          })
        }
      >
        Add Question
      </Button>
    </div>
  </div>
)}
    
  </div>
))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 "> 
            <Button className="bg-primary p-2 rounded-xl text-white"
              type="button"
              variant="outline"
              onClick={() =>
                setEditorState((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        levels: [
                          ...(prev.levels ?? []),
                          {
                            id: `lesson-${Date.now()}`,
                            type: "lesson",
                            title: "New Lesson",
                            shortTitle: "Lesson",
                            xp: 10,
                            narrative: [],
                          },
                        ],
                      }
                    : prev
                )
              }
            >
              Add Lesson
            </Button>

            <Button className="bg-primary p-2 rounded-xl text-white"
              type="button"
              variant="outline"
              onClick={() =>
                setEditorState((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        levels: [
                          ...(prev.levels ?? []),
                          {
                            id: `scenario-${Date.now()}`,
                            type: "scenario",
                            title: "New Scenario",
                            shortTitle: "Scenario",
                            xp: 15,
                            prompt: "",
                            situation: "",
                            choices: [],
                          },
                        ],
                      }
                    : prev
                )
              }
            >
             Add Scenerio
            </Button>

            <Button className="bg-primary p-2 rounded-xl text-white"
  type="button"
  variant="outline"
  onClick={() =>
    setEditorState((prev: any) =>
      prev
        ? {
            ...prev,
            levels: [
              ...(prev.levels ?? []),
              {
                id: `quiz-${Date.now()}`,
                type: "quick_check",
                title: "New Multiple Choice Quiz",
                shortTitle: "Quiz",
                xp: 15,
                questions: [
                  {
                    id: `question-${Date.now()}`,
                    question: "New quiz question",
                    answers: [
                      {
                        id: `answer-${Date.now()}-a`,
                        label: "Correct answer",
                        correct: true,
                      },
                      {
                        id: `answer-${Date.now()}-b`,
                        label: "Incorrect answer",
                        correct: false,
                      },
                    ],
                    explanation: "",
                  },
                ],
              },
            ],
          }
        : prev,
    )
  }
>
  Add Multiple Choice Quiz
</Button>
          </div>
        </div>
      </>
    )}
  </CardContent>
</Card>
          

           <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Program Settings</CardTitle>
              <CardDescription>
                Basic certification settings for this machine.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <Field label="Title">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>

              <Field label="Description">
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Passing Score">
                  <Input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                  />
                </Field>

                <Field label="Estimated Minutes">
                  <Input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  />
                </Field>

                <Field label="Expiration (days)">
                  <Input
                    type="number"
                    value={expiresInDays}
                    onChange={(e) =>
                      setExpiresInDays(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isRequired"
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
                <label htmlFor="isRequired" className="text-sm font-medium">
                  Required before machine use
                </label>
              </div>
            </CardContent>
          </Card> 
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Certification Summary</CardTitle>
              <CardDescription>
                Current settings and machine relationship.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <SummaryRow label="Machine" value={data.machine.name} />
              <SummaryRow label="Status" value={summaryStatus} />
<SummaryRow label="Title" value={summaryTitle || "Untitled"} />
<SummaryRow label="Levels" value={`${summaryLevelCount}`} />
<SummaryRow label="Passing Score" value={`${summaryPassingScore}%`} />
<SummaryRow label="Estimated Time" value={`${summaryEstimatedMinutes} min`} />
<SummaryRow label="Required" value={isRequired ? "Yes" : "No"} />

              {selectedTemplate && (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 font-medium text-slate-900">
                    <ShieldCheck className="h-4 w-4" />
                    Selected Template
                  </div>
                  <p className="text-sm text-slate-600">{selectedTemplate.title}</p>
                </div>
              )}
            </CardContent>
          </Card>

          

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button onClick={handleSaveDraft} disabled={isSaving} className="w-full rounded-xl">
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>

              <Button onClick={handlePublish} disabled={isSaving} variant="outline" className="w-full rounded-xl">
                Publish
              </Button>
              {saveMessage && (
  <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
    {saveMessage}
  </div>
)}



              <Button
  variant="ghost"
  className="w-full rounded-xl"
  disabled={!data.activeProgram?.id}
  onClick={() => {
    if (!data.activeProgram?.id) return;
  
    const errors = validateCertification({
      ...editorState,
      title,
      passingScore,
      estimatedMinutes,
    });
  
    if (errors.length > 0) {
      setValidationErrors(errors);
      setSaveMessage("Complete your certification before previewing.");
      return;
    }
  
    setValidationErrors([]);
  
    setLocation(
      `/app/admin/machines/${machineId}/certification/preview`,
    );
  }}
  
>
  {data.activeProgram?.id ? "Preview as Member" : "Save or publish first"}






  
</Button>

            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  );
}

function SourceOption({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-4 text-left transition",
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
      ].join(" ")}
    >
      <div className="font-semibold">{title}</div>
      <div className={selected ? "mt-1 text-sm text-slate-200" : "mt-1 text-sm text-slate-600"}>
        {description}
      </div>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}