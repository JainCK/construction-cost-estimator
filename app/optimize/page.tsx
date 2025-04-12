"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowLeft,
  TrendingDown,
  Package,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import Footer from "@/components/footer";
import { MaterialAlternative } from "@/types";

export default function OptimizationPage() {
  const [alternatives, setAlternatives] = useState<MaterialAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const materialId = searchParams.get("materialId");
  const quantity = searchParams.get("quantity");
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    async function fetchAlternatives() {
      if (!materialId || !quantity) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/alternatives/${materialId}?quantity=${quantity}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch alternatives");
        }
        const data = await response.json();
        setAlternatives(data);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAlternatives(data);
      } catch (err) {
        setError("Error loading alternatives");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlternatives();
  }, [materialId, quantity]);

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
              className="absolute inset-0 rounded-full border-4 border-amber-500/30"
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-amber-500/70"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: 0.2,
              }}
            />
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 flex items-center justify-center">
              <TrendingDown className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <p className="text-xl font-medium">
            Finding cost-saving alternatives...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
        <div className="container mx-auto py-12 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-xl text-rose-500 mb-6">{error}</p>
            <Link href={`/results?id=${projectId}`}>
              <Button className="bg-rose-500 hover:bg-rose-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Results
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
            Cost{" "}
            <span className="text-amber-500 dark:text-amber-400">
              Optimization
            </span>{" "}
            Suggestions
          </h1>
          <p className="text-muted-foreground">
            Explore alternative materials that could help reduce your project
            costs
          </p>
        </motion.div>

        {alternatives.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 border-none shadow-xl overflow-hidden bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 dark:from-amber-900/20 dark:to-amber-900/10 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  No Alternatives Found
                </CardTitle>
                <CardDescription>
                  We couldn't find any lower-cost alternatives for the selected
                  material.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-6 text-muted-foreground">
                  The material you selected already offers good value for its
                  category.
                </p>
                <Link href={`/results?id=${projectId}`}>
                  <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 dark:from-rose-600 dark:to-amber-600 dark:hover:from-rose-700 dark:hover:to-amber-700">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Results
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card className="mb-8 border-none shadow-xl overflow-hidden bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-900 dark:to-gray-800/50">
                <CardHeader className="bg-gradient-to-r from-rose-500/10 to-rose-500/5 dark:from-rose-900/20 dark:to-rose-900/10 border-b">
                  <CardTitle className="flex items-center pt-5 gap-2">
                    <Package className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                    Current Material
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-medium">
                        {alternatives[0].original.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">
                        {alternatives[0].originalQuantity}{" "}
                        {alternatives[0].original.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-medium">
                        ${alternatives[0].original.rate.toFixed(2)} per{" "}
                        {alternatives[0].original.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span className="font-medium text-rose-500 dark:text-rose-400">
                        ${alternatives[0].originalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.h2
              variants={item}
              className="text-2xl font-semibold mb-6 flex items-center gap-2"
            >
              <Lightbulb className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              Alternative Options
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {alternatives.map((alt, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{
                    y: -5,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <Card className="h-full border-none shadow-xl overflow-hidden bg-gradient-to-br from-white to-cyan-50/30 dark:from-gray-900 dark:to-gray-800/50">
                    <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 dark:from-cyan-900/20 dark:to-cyan-900/10 border-b">
                      <CardTitle className="pt-5">
                        {alt.alternative.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                        Potential Savings:{" "}
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold">
                          ${alt.potentialSavings.toFixed(2)}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Quantity Needed:
                        </span>
                        <span>
                          {alt.originalQuantity} {alt.alternative.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Rate:</span>
                        <span>
                          ${alt.alternative.rate.toFixed(2)} per{" "}
                          {alt.alternative.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total Cost:
                        </span>
                        <span className="font-medium text-cyan-500 dark:text-cyan-400">
                          ${alt.alternativeCost.toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full bg-muted/50 rounded-full h-2.5 mt-4">
                        <motion.div
                          className="bg-emerald-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (alt.potentialSavings / alt.originalCost) * 100
                            }%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        ></motion.div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>New Cost</span>
                        <span>
                          {(
                            (alt.potentialSavings / alt.originalCost) *
                            100
                          ).toFixed(1)}
                          % Savings
                        </span>
                      </div>

                      {alt.alternative.description && (
                        <div className="mt-6 pt-4 border-t border-muted">
                          <span className="font-medium block mb-2">
                            Description:
                          </span>
                          <p className="text-muted-foreground text-sm">
                            {alt.alternative.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div variants={item} className="flex justify-end">
              <Link href={`/results?id=${projectId}`}>
                <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 dark:from-rose-600 dark:to-amber-600 dark:hover:from-rose-700 dark:hover:to-amber-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Results
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
