"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  Calculator,
  ArrowRight,
  Ruler,
  Briefcase,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Footer from "@/components/footer";

// Mock Material type since it's imported from @/types
type Material = {
  id: string;
  name: string;
  rate: number;
  unit: string;
};

// Form schema with Zod validation
const formSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  dimensions: z.object({
    length: z.number().positive("Length must be positive"),
    width: z.number().positive("Width must be positive"),
    height: z.number().positive("Height must be positive"),
    unit: z.enum(["meters", "feet"]),
  }),
  materials: z
    .array(
      z.object({
        materialId: z.string().min(1, "Please select a material"),
        quantity: z.number().positive("Quantity must be positive"),
      })
    )
    .min(1, "At least one material is required"),
  laborHours: z.object({
    skilled: z.number().min(0, "Cannot be negative"),
    unskilled: z.number().min(0, "Cannot be negative"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EstimatePage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "meters",
      },
      materials: [{ materialId: "", quantity: 1 }],
      laborHours: {
        skilled: 0,
        unskilled: 0,
      },
    },
  });

  // Setup field array for dynamic material inputs
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  // Fetch materials on component mount
  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await fetch("/api/materials");
        if (!response.ok) throw new Error("Failed to fetch materials");
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    }

    fetchMaterials();
  }, []);

  // Form submission handler
  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    console.log("Form Values being sent:", JSON.stringify(values, null, 2));
    try {
      const response = await fetch("/api/calculate-cost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      const data = await response.json();
      router.push(`/results?id=${data.projectId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
            Project{" "}
            <span className="text-rose-500 dark:text-rose-400">Estimator</span>
          </h1>
          <p className="text-muted-foreground">
            Enter your project details to get an accurate cost breakdown
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show">
          <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 dark:from-rose-900/20 dark:to-amber-900/20 border-b">
              <CardTitle className="flex items-center pt-5 gap-2">
                <Calculator className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                Enter your project information
              </CardTitle>
              <CardDescription>
                Fill in the details below to calculate the estimated cost of
                your construction project
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Project Name */}
                  <motion.div variants={item}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Project Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="My Construction Project"
                              {...field}
                              className="border-muted-foreground/20 focus-visible:ring-rose-500"
                            />
                          </FormControl>
                          <FormMessage className="text-rose-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Dimensions Section */}
                  <motion.div variants={item} className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
                      Dimensions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="dimensions.length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                className="border-muted-foreground/20 focus-visible:ring-cyan-500"
                                {...field}
                                onChange={(e) => {
                                  const parsedValue = Number.parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(parsedValue) ? 0 : parsedValue
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-rose-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dimensions.width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                className="border-muted-foreground/20 focus-visible:ring-cyan-500"
                                {...field}
                                onChange={(e) => {
                                  const parsedValue = Number.parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(parsedValue) ? 0 : parsedValue
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-rose-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dimensions.height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                className="border-muted-foreground/20 focus-visible:ring-cyan-500"
                                {...field}
                                onChange={(e) => {
                                  const parsedValue = Number.parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(parsedValue) ? 0 : parsedValue
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-rose-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="dimensions.unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-muted-foreground/20 focus-visible:ring-cyan-500">
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="meters">Meters</SelectItem>
                              <SelectItem value="feet">Feet</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-rose-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Materials Section */}
                  <motion.div variants={item} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                        Materials
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ materialId: "", quantity: 1 })}
                        className="border-amber-500/50 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Material
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          className="flex gap-4 items-end p-4 rounded-lg border border-muted-foreground/10 bg-muted/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex-grow">
                            <FormField
                              control={form.control}
                              name={`materials.${index}.materialId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Material</FormLabel>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(value || "")
                                    }
                                    value={field.value || ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="border-muted-foreground/20 focus-visible:ring-amber-500">
                                        <SelectValue placeholder="Select material" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {materials.map((material) => (
                                        <SelectItem
                                          key={material.id}
                                          value={material.id}
                                        >
                                          {material.name} (${material.rate}/
                                          {material.unit})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-rose-500" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="w-32">
                            <FormField
                              control={form.control}
                              name={`materials.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="border-muted-foreground/20 focus-visible:ring-amber-500"
                                      {...field}
                                      onChange={(e) => {
                                        const parsedValue = Number.parseFloat(
                                          e.target.value
                                        );
                                        field.onChange(
                                          isNaN(parsedValue) ? 0 : parsedValue
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-rose-500" />
                                </FormItem>
                              )}
                            />
                          </div>

                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="mb-2 bg-rose-500 hover:bg-rose-600"
                              onClick={() => remove(index)}
                            >
                              <Minus className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Labor Hours Section */}
                  <motion.div variants={item} className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                      Labor Hours
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="laborHours.skilled"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skilled Labor (hours)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                className="border-muted-foreground/20 focus-visible:ring-rose-500"
                                {...field}
                                onChange={(e) => {
                                  const parsedValue = Number.parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(parsedValue) ? 0 : parsedValue
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-rose-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="laborHours.unskilled"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unskilled Labor (hours)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                className="border-muted-foreground/20 focus-visible:ring-rose-500"
                                {...field}
                                onChange={(e) => {
                                  const parsedValue = Number.parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(parsedValue) ? 0 : parsedValue
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-rose-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-6 text-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 dark:from-rose-600 dark:to-amber-600 dark:hover:from-rose-700 dark:hover:to-amber-700"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Calculating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Calculate Cost
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
