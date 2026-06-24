import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CertificationReviewStep({ engine }: { engine: any }) {
  const maxPossibleScore = engine.levels.reduce(
    (sum: number, level: any) => sum + (level.xp ?? 0),
    0,
  );

  const percentScore =
    maxPossibleScore > 0
      ? Math.round((engine.totalScore / maxPossibleScore) * 100)
      : 0;

  const passed = percentScore >= (engine.module?.passingScore ?? 80);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Certification Review</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-4xl font-bold">{percentScore}%</div>

          <p className="text-sm text-slate-600">
            Passing score: {engine.module?.passingScore ?? 80}%
          </p>

          <div
            className={`rounded-2xl p-4 text-sm ${
              passed
                ? "bg-emerald-50 text-emerald-800"
                : "bg-rose-50 text-rose-800"
            }`}
          >
            {passed
              ? "You passed the knowledge check. The final step is scheduling an in-person review with staff."
              : "You did not pass yet. Review the material and try again."}
          </div>

          {passed ? (
            <Button className="rounded-xl" onClick={engine.submitCertification}>
              Submit Certification
            </Button>
          ) : (
            <Button className="rounded-xl" onClick={engine.restart}>
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}