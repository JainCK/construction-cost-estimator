"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
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
import {
  Download,
  ArrowLeft,
  FileSearch,
  PieChart,
  DollarSign,
  Package,
} from "lucide-react";
import Footer from "@/components/footer";

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

        // Using mock data
        setProject(data);
      } catch (err) {
        setError("Error loading project data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Simulate loading
    setTimeout(() => {
      fetchProjectData();
    }, 1000);
  }, [projectId]);

  const generateReport = () => {
    if (!project) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create data for summary sheet
    const summaryData = [
      ["Cost Estimation Report", project.name],
      [],
      ["Total Estimated Cost", `$${project.totalCost.toFixed(2)}`],
      [],
      ["Cost Breakdown", "Amount", "Percentage"],
      [
        "Materials",
        `$${project.costBreakdown.materials.toFixed(2)}`,
        `${(
          (project.costBreakdown.materials / project.totalCost) *
          100
        ).toFixed(1)}%`,
      ],
      [
        "Labor",
        `$${project.costBreakdown.labor.toFixed(2)}`,
        `${((project.costBreakdown.labor / project.totalCost) * 100).toFixed(
          1
        )}%`,
      ],
      [
        "Overhead",
        `$${project.costBreakdown.overhead.toFixed(2)}`,
        `${((project.costBreakdown.overhead / project.totalCost) * 100).toFixed(
          1
        )}%`,
      ],
    ];

    // Create detailed materials sheet
    const materialsHeaders = [
      "Material Name",
      "Quantity",
      "Unit Cost",
      "Total Cost",
    ];
    const materialsData = project.materialCosts.map((material) => [
      material.materialName,
      material.quantity,
      `$${material.unitCost.toFixed(2)}`,
      `$${material.totalCost.toFixed(2)}`,
    ]);

    // Combine headers and data
    const materialsSheet = [materialsHeaders, ...materialsData];

    // Create worksheets from data
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    const materialsWorksheet = XLSX.utils.aoa_to_sheet(materialsSheet);

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, summaryWorksheet, "Summary");
    XLSX.utils.book_append_sheet(wb, materialsWorksheet, "Material Details");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create Blob and download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-cost-estimate.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-20 h-20 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-rose-500/30"
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-rose-500/70"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: 0.2,
              }}
            />
            <div className="absolute inset-0 rounded-full border-4 border-rose-500 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <p className="text-xl font-medium">Loading project results...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
        <div className="container mx-auto py-12 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-xl text-rose-500 mb-6">
              {error || "Project not found"}
            </p>
            <Link href="/estimate">
              <Button className="bg-rose-500 hover:bg-rose-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Estimator
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-rose-500 dark:text-rose-400">
              {project.name}
            </span>{" "}
            - Cost Estimate
          </h1>
          <p className="text-muted-foreground">
            Detailed breakdown of estimated costs for your construction project
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <motion.div variants={item}>
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader className="bg-gradient-to-r from-rose-500/10 to-rose-500/5 dark:from-rose-900/20 dark:to-rose-900/10 border-b">
                <CardTitle className="flex items-center pt-5 gap-2">
                  <DollarSign className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                  Total Estimated Cost
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <motion.p
                  className="text-4xl font-bold text-rose-500 dark:text-rose-400"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  ${project.totalCost.toFixed(2)}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-white to-cyan-50/30 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 dark:from-cyan-900/20 dark:to-cyan-900/10 border-b">
                <CardTitle className="flex items-center pt-5 gap-2">
                  <PieChart className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                      Materials:
                    </span>
                    <span className="font-medium">
                      ${project.costBreakdown.materials.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2.5">
                    <motion.div
                      className="bg-rose-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (project.costBreakdown.materials /
                            project.totalCost) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      Labor:
                    </span>
                    <span className="font-medium">
                      ${project.costBreakdown.labor.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2.5">
                    <motion.div
                      className="bg-amber-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (project.costBreakdown.labor / project.totalCost) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 1, delay: 0.7 }}
                    ></motion.div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                      Overhead:
                    </span>
                    <span className="font-medium">
                      ${project.costBreakdown.overhead.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2.5">
                    <motion.div
                      className="bg-cyan-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (project.costBreakdown.overhead / project.totalCost) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 1, delay: 0.9 }}
                    ></motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-8 border-none shadow-xl overflow-hidden bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 dark:from-amber-900/20 dark:to-amber-900/10 border-b">
              <CardTitle className="flex items-center pt-5 gap-2">
                <Package className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                Material Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.materialCosts.map((material, index) => (
                      <motion.tr
                        key={material.materialId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="border-b last:border-0"
                      >
                        <TableCell className="font-medium">
                          {material.materialName}
                        </TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>${material.unitCost.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">
                          ${material.totalCost.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/optimize?materialId=${material.materialId}&quantity=${material.quantity}&projectId=${projectId}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-500/50 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/50"
                            >
                              <FileSearch className="h-4 w-4 mr-1" />
                              Find Alternatives
                            </Button>
                          </Link>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-end"
        >
          <Button
            variant="outline"
            onClick={generateReport}
            className="border-rose-500/50 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Link href="/estimate">
            <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 dark:from-rose-600 dark:to-amber-600 dark:hover:from-rose-700 dark:hover:to-amber-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Create New Estimate
            </Button>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
