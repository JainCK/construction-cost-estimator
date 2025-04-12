# Construction Cost Estimator

A comprehensive web application for estimating construction project costs with material selection, cost breakdowns, and optimization suggestions.

## 🔗 Live Demo

[https://construction-estimator.vercel.app](https://construction-estimator.vercel.app)

## 📚 Overview

The Construction Cost Estimator is a Next.js application that helps users calculate accurate cost estimates for construction projects. It provides detailed breakdowns of material costs, labor expenses, and overhead, along with suggestions for cost-saving alternatives.

## ✨ Features

- **Project Estimation**: Input project details, dimensions, materials, and labor hours
- **Detailed Cost Breakdown**: View comprehensive cost analysis including materials, labor, and overhead
- **Material Selection**: Choose from a range of construction materials with up-to-date market rates
- **Cost Optimization**: Get suggestions for alternative materials to reduce project costs
- **Report Generation**: Download project cost estimates as text reports
- **Responsive Design**: Full mobile and desktop compatibility with smooth animations

## 🏗️ Project Structure

### Pages

- **Home (/)**: Landing page with feature overview and call-to-action
- **Estimate (/estimate)**: Form for creating new project cost estimates
- **Results (/results)**: Detailed view of project cost breakdowns
- **Optimize (/optimize)**: Cost-saving material alternatives suggestions

### API Routes

- `/api/materials`: Fetches all available construction materials
- `/api/alternatives/[materialId]`: Gets cost-saving alternatives for a specific material
- `/api/calculate-cost`: Calculates total project cost based on inputs
- `/api/projects/[id]`: Retrieves saved project data

## 🧩 Components

Key UI components:

- Forms with validation
- Data tables
- Cards for content organization
- Interactive buttons and inputs
- Animations using Framer Motion

## 🛠️ Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Prisma**: ORM for database management
- **React Hook Form**: For form handling with validation
- **Zod**: For schema validation
- **Framer Motion**: For smooth animations
- **Lucide React**: For icons
- **ShadCN UI**: For accessible UI components

## 📊 Data Flow

1. User enters project details in the estimation form
2. Form data is validated with React Hook Form and Zod
3. Project data is sent to the `/api/calculate-cost` endpoint
4. Cost is calculated based on materials, dimensions, and labor hours
5. Project is saved to the database and results are displayed
6. User can view alternatives or download the cost report

## 💻 Code Structure

```
/app
  /api
    /alternatives/[materialId]
    /calculate-cost
    /materials
    /projects/[id]
  /estimate
  /optimize
  /results
  /globals.css
  /layout.tsx
  /page.tsx
/components
  /ui
  footer.tsx
/lib
  /generated/prisma
  costCalculator.ts
  materials.ts
/types
```

## 📡 API Endpoints

### `GET /api/materials`

Returns a list of all available construction materials with their rates and units.

### `GET /api/alternatives/[materialId]`

**Parameters:**

- `materialId`: ID of the material to find alternatives for
- `quantity` (query parameter): Amount of material needed

Returns cost-saving alternative materials with potential savings calculations.

### `POST /api/calculate-cost`

**Accepts:**

```typescript
{
  name: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: "meters" | "feet";
  }
  materials: {
    materialId: string;
    quantity: number;
  }
  [];
  laborHours: {
    skilled: number;
    unskilled: number;
  }
}
```

**Returns:**

```typescript
{
  projectId: string;
  totalCost: number;
  costBreakdown: {
    materials: number;
    labor: number;
    overhead: number;
  }
  materialCosts: {
    materialId: string;
    materialName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }
  [];
}
```

### `GET /api/projects/[id]`

Returns detailed information about a saved project, including cost breakdown and materials used.

## 📝 Form Validation

The application uses Zod for form validation:

```typescript
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
```

## 🎨 UI Features

- Gradient backgrounds
- Card-based interface
- Animated component transitions
- Responsive design for all device sizes
- Dark mode support
- Accessible form controls

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- PostgreSQL database (for production)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/JainCK/construction-cost-estimator.git
cd construction-estimator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/construction_db"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to view the application.

## 📈 Future Enhancements

- User authentication and saved projects
- PDF report generation
- Integration with supplier APIs for real-time pricing
- Project timeline estimation
- Material quantity calculator based on dimensions
- 3D visualization of projects

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- **Your Name** - Initial work - [YourGitHubUsername](https://github.com/JainCK)

## 🙏 Acknowledgments

- Icon library: [Lucide Icons](https://lucide.dev/)
- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Animation library: [Framer Motion](https://www.framer.com/motion/)
