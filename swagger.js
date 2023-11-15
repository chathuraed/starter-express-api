const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express API for JSONPlaceholder",
      version: "1.0.0",
      description:
        "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "JSONPlaceholder",
        url: "https://jsonplaceholder.typicode.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Local Development server",
      },
      {
        url: "https://seatwise.cyclic.app/api",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        UserLogin: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
        },
        RefreshToken: {
          type: "object",
          properties: {
            refreshToken: {
              type: "string",
              description: "The refresh token for the user",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              description: "The new access token for the user",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
