// app/optimize/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MaterialAlternative } from "@/types";

export default function OptimizationPage() {
  const [alternatives, setAlternatives] = useState<MaterialAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const materialId = searchParams.get("materialId");
  const quantity = searchParams.get("quantity");

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
      } catch (err) {
        setError("Error loading alternatives");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlternatives();
  }, [materialId, quantity]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="text-xl">Finding cost-saving alternatives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-xl text-red-600 mb-6">{error}</p>
        <Link href={`/results?id=${searchParams.get("projectId")}`}>
          <Button>Return to Results</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Cost Optimization Suggestions</h1>

      {alternatives.length === 0 ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>No Alternatives Found</CardTitle>
            <CardDescription>
              We couldn't find any lower-cost alternatives for the selected
              material.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The material you selected already offers good value for its
              category.
            </p>
            <Link href={`/results?id=${searchParams.get("projectId")}`}>
              <Button>Return to Results</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Material</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span className="font-medium">
                    {alternatives[0].original.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">
                    {alternatives[0].originalQuantity}{" "}
                    {alternatives[0].original.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-medium">
                    ${alternatives[0].original.rate.toFixed(2)} per{" "}
                    {alternatives[0].original.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">
                    ${alternatives[0].originalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-4">Alternative Options</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {alternatives.map((alt, index) => (
              <Card key={index} className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle>{alt.alternative.name}</CardTitle>
                  <CardDescription>
                    Potential Savings:{" "}
                    <span className="text-green-600 font-bold">
                      ${alt.potentialSavings.toFixed(2)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>Quantity Needed:</span>
                    <span>
                      {alt.originalQuantity} {alt.alternative.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span>
                      ${alt.alternative.rate.toFixed(2)} per{" "}
                      {alt.alternative.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span>${alt.alternativeCost.toFixed(2)}</span>
                  </div>
                  {alt.alternative.description && (
                    <div className="mt-4">
                      <span className="font-medium">Description:</span>
                      <p>{alt.alternative.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Link href={`/results?id=${searchParams.get("projectId")}`}>
              <Button>Return to Results</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
