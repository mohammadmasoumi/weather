import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Request, Response } from "express";

const PORT = process.env.PORT || 5000;

// Swagger definition options
const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Weather API",
            version: "1.0.0",
            description: "API documentation for the Weather App",
        },
    },
    apis: ["./src/routes/*.ts"], // Path to API route files
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Function to set up Swagger in the Express app
export const setupSwagger = (app: Application): void => {
    // Serve Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Serve Swagger JSON
    app.get("/api-docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.json(swaggerSpec);
    });

    console.log(`📄 Swagger documentation is available at http://localhost:${PORT}/api-docs`);
};