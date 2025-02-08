import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Request, Response } from "express";

const PORT = process.env.PORT || 5000;

const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Weather API",
            version: "1.0.0",
            description: "API documentation for the Weather App",
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Weather: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "660f4d0a3e8a8d1a9c9f0b5a"
                        },
                        cityName: {
                            type: "string",
                            example: "London"
                        },
                        country: {
                            type: "string",
                            example: "UK"
                        },
                        temperature: {
                            type: "number",
                            example: 15.5
                        },
                        description: {
                            type: "string",
                            example: "Cloudy"
                        },
                        humidity: {
                            type: "integer",
                            example: 75
                        },
                        windSpeed: {
                            type: "number",
                            example: 3.6
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-04-05T14:30:00Z"
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/api-docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.json(swaggerSpec);
    });
    console.log(`📄 Swagger docs available at http://localhost:${PORT}/api-docs`);
};