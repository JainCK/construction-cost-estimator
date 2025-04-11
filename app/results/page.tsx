"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrismaClient } from "@/lib/generated/prisma";

interface ProjectResult {
  id: string;
  name: string;
  totalCost: number;
  costBreakdown: {
    materials: number;
    labor: number;
    overhead: number;
  };

  materialCosts: {
    materialId: string;
    materialName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
}

export default function ResultsPage() {
  const [project, setProject] = useState<ProjectResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  useEffect(() => {
    async function fetchProjectData() {
      if (!projectId) {
        setError("No project ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError("Error loading project data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId]);

  const generateReport = () => {
    if (!project) return;

    const reportContent = `
# Cost Estimation Report: ${project.name}

## Total Estimated Cost: $${project.totalCost.toFixed(2)}

## Cost Breakdown
- Materials: $${project.costBreakdown.materials.toFixed(2)} (${(
      (project.costBreakdown.materials / project.totalCost) *
      100
    ).toFixed(1)}%)
- Labor: $${project.costBreakdown.labor.toFixed(2)} (${(
      (project.costBreakdown.labor / project.totalCost) *
      100
    ).toFixed(1)}%)
- Overhead: $${project.costBreakdown.overhead.toFixed(2)} (${(
      (project.costBreakdown.overhead / project.totalCost) *
      100
    ).toFixed(1)}%)

## Material Costs
${project.materialCosts
  .map(
    (material) =>
      `- ${material.materialName}: ${
        material.quantity
      } units at $${material.unitCost.toFixed(
        2
      )} each = $${material.totalCost.toFixed(2)}`
  )
  .join("\n")}
`;

    // Create and download the file
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-cost-estimate.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="text-xl">Loading project results...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-xl text-red-600 mb-6">
          {error || "Project not found"}
        </p>
        <Link href="/estimate">
          <Button>Return to Estimator</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {project.name} - Cost Estimate
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              ${project.totalCost.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Materials:</span>
                <span className="font-medium">
                  ${project.costBreakdown.materials.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Labor:</span>
                <span className="font-medium">
                  ${project.costBreakdown.labor.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Overhead:</span>
                <span className="font-medium">
                  ${project.costBreakdown.overhead.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Material Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.materialCosts.map((material) => (
                <TableRow key={material.materialId}>
                  <TableCell>{material.materialName}</TableCell>
                  <TableCell>{material.quantity}</TableCell>
                  <TableCell>${material.unitCost.toFixed(2)}</TableCell>
                  <TableCell>${material.totalCost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/optimize?materialId=${material.materialId}&quantity=${material.quantity}&projectId=${projectId}`}
                    >
                      <Button variant="outline" size="sm">
                        Find Alternatives
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={generateReport}>
          Download Report
        </Button>
        <Link href="/estimate">
          <Button>Create New Estimate</Button>
        </Link>
      </div>
    </div>
  );
}
