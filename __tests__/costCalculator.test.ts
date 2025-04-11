// // __tests__/costCalculator.test.ts

// import { calculateProjectCost } from "../lib/costCalculator";
// import { ProjectInput } from "../types";
// import { Prisma } from "@/lib/generated/prisma";

// // Mock the Prisma client
// jest.mock("@prisma/client", () => {
//   const mockMaterial = {
//     id: "material-1",
//     name: "Test Material",
//     category: "Test Category",
//     rate: 100.0,
//     unit: "unit",
//   };

//   return {
//     PrismaClient: jest.fn().mockImplementation(() => ({
//       material: {
//         findUnique: jest.fn().mockImplementation(({ where }) => {
//           if (where.id === "material-1") {
//             return Promise.resolve(mockMaterial);
//           }
//           return Promise.resolve(null);
//         }),
//       },
//     })),
//   };
// });

// describe("Cost Calculator", () => {
//   test("should calculate project cost correctly", async () => {
//     // Arrange
//     const projectInput: ProjectInput = {
//       name: "Test Project",
//       dimensions: {
//         length: 10,
//         width: 10,
//         height: 3,
//         unit: "meters",
//       },
//       materials: [{ materialId: "material-1", quantity: 5 }],
//       laborHours: {
//         skilled: 10,
//         unskilled: 20,
//       },
//     };

//     // Act
//     const result = await calculateProjectCost(projectInput);

//     // Assert
//     // Material cost: 5 * $100 = $500
//     // Labor cost: (10 * $45) + (20 * $25) = $450 + $500 = $950
//     // Overhead: ($500 + $950) * 0.15 = $217.50
//     // Total: $500 + $950 + $217.50 = $1,667.50

//     expect(result.totalCost).toBeCloseTo(1667.5, 2);
//     expect(result.costBreakdown.materials).toBeCloseTo(500.0, 2);
//     expect(result.costBreakdown.labor).toBeCloseTo(950.0, 2);
//     expect(result.costBreakdown.overhead).toBeCloseTo(217.5, 2);
//     expect(result.materialCosts).toHaveLength(1);
//     expect(result.materialCosts[0].materialName).toBe("Test Material");
//     expect(result.materialCosts[0].totalCost).toBeCloseTo(500.0, 2);
//   });

//   test("should throw error for invalid material ID", async () => {
//     // Arrange
//     const projectInput: ProjectInput = {
//       name: "Test Project",
//       dimensions: {
//         length: 10,
//         width: 10,
//         height: 3,
//         unit: "meters",
//       },
//       materials: [{ materialId: "invalid-id", quantity: 5 }],
//       laborHours: {
//         skilled: 10,
//         unskilled: 20,
//       },
//     };

//     // Act & Assert
//     await expect(calculateProjectCost(projectInput)).rejects.toThrow();
//   });
// });
