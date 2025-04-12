"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight, Layers, BarChart3, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

export default function Home() {
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
      {/* Hero Section */}
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Construction Cost{" "}
            <span className="text-rose-500 dark:text-rose-400">Estimator</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Quickly estimate construction costs for your project with our
            easy-to-use tool. Input your project details and get instant cost
            breakdowns.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="pt-4"
          >
            <Link href="/estimate">
              <Button
                size="lg"
                className="px-8 py-6 text-lg rounded-full group bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
              >
                Start Estimating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Powerful Estimation Tools
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div variants={item}>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-rose-50 dark:from-gray-900 dark:to-gray-800">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 rounded-bl-full -mt-8 -mr-8"></div>
              <CardHeader>
                <div className="bg-rose-500/20 p-3 rounded-lg w-fit mb-4">
                  <Layers className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                </div>
                <CardTitle className="text-xl group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                  Material Selection
                </CardTitle>
                <CardDescription>
                  Choose from a range of construction materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Select from concrete, steel, lumber, and other building
                  materials with pre-loaded market rates that update regularly
                  and accurately.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-cyan-50 dark:from-gray-900 dark:to-gray-800">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/20 rounded-bl-full -mt-8 -mr-8"></div>
              <CardHeader>
                <div className="bg-cyan-500/20 p-3 rounded-lg w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />
                </div>
                <CardTitle className="text-xl group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  Detailed Breakdown
                </CardTitle>
                <CardDescription>See where your money is going</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get a detailed breakdown of material costs, labor expenses,
                  and overhead to understand your budget better and plan
                  accordingly.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-gray-800">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-bl-full -mt-8 -mr-8"></div>
              <CardHeader>
                <div className="bg-amber-500/20 p-3 rounded-lg w-fit mb-4">
                  <Calculator className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  Cost Optimization
                </CardTitle>
                <CardDescription>Find ways to save</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive suggestions for alternative materials and approaches
                  that could reduce your overall project cost without
                  compromising quality.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-16 px-4"
      >
        <div className="bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-cyan-500/20 dark:from-rose-900/40 dark:via-amber-900/40 dark:to-cyan-900/40 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm z-0"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to start your project?</h2>
            <p className="text-lg text-muted-foreground">
              Get accurate cost estimates in minutes, not hours. Our tool helps
              you plan your budget with confidence.
            </p>
            <div className="pt-4">
              <Link href="/estimate">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 dark:from-rose-600 dark:to-amber-600 dark:hover:from-rose-700 dark:hover:to-amber-700"
                >
                  Create Your First Estimate
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
