import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const sessionsData = [
  { day: "Mon", sessions: 18 },
  { day: "Tue", sessions: 24 },
  { day: "Wed", sessions: 20 },
  { day: "Thu", sessions: 31 },
  { day: "Fri", sessions: 28 },
  { day: "Sat", sessions: 35 },
  { day: "Sun", sessions: 12 },
];

const escalationData = [
  { week: "Week 1", rate: 8 },
  { week: "Week 2", rate: 5 },
  { week: "Week 3", rate: 12 },
  { week: "Week 4", rate: 6 },
  { week: "Week 5", rate: 3 },
  { week: "Week 6", rate: 7 },
  { week: "Week 7", rate: 4 },
];

const checklistData = [
  { month: "Oct", rate: 78 },
  { month: "Nov", rate: 82 },
  { month: "Dec", rate: 85 },
  { month: "Jan", rate: 87 },
  { month: "Feb", rate: 89 },
];

const toolUsageData = [
  { tool: "Laser Cutter", sessions: 145 },
  { tool: "3D Printer", sessions: 98 },
  { tool: "Electronics", sessions: 42 },
];

const periods = ["Last 7 days", "Last 30 days", "Last 90 days"];

export default function AdminMetrics() {
  const [activePeriod, setActivePeriod] = useState("Last 7 days");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Metrics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Track usage, escalation rates, and checklist performance.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {periods.map((period) => (
          <Button
            key={period}
            variant={activePeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePeriod(period)}
            data-testid={`button-period-${period.toLowerCase().replace(/\s/g, "-")}`}
          >
            {period}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-chart-1" />
              <CardTitle className="text-base">Sessions Over Time</CardTitle>
            </div>
            <CardDescription>Daily session count for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sessionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="sessions" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-4" />
              <CardTitle className="text-base">Escalation Rate</CardTitle>
            </div>
            <CardDescription>Weekly escalation count trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={escalationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Checklist Completion Rate</CardTitle>
            <CardDescription>Monthly pass rate trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={checklistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`${value}%`, "Completion"]}
                />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tool Usage</CardTitle>
            <CardDescription>Total sessions by equipment category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={toolUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="tool" type="category" width={100} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="sessions" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
