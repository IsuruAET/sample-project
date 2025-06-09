import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../errorHandler";
import { AppError } from "../../errors/AppError";
import { ZodError } from "zod";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    process.env.NODE_ENV = "test";
  });

  it("should handle AppError correctly", () => {
    const appError = new AppError(400, "Test error");

    errorHandler(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Test error",
    });
  });

  it("should handle ZodError correctly", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        path: ["name"],
        message: "Required",
        expected: "string",
        received: "undefined",
      },
    ]);

    errorHandler(
      zodError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Validation error",
      errors: [
        {
          path: "name",
          message: "Required",
        },
      ],
    });
  });

  it("should handle MongoDB duplicate key error", () => {
    const mongoError = new Error("Duplicate key error");
    (mongoError as any).name = "MongoServerError";
    (mongoError as any).code = 11000;

    errorHandler(
      mongoError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Duplicate field value entered",
    });
  });

  it("should handle unknown errors with 500 status", () => {
    const unknownError = new Error("Unknown error");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    errorHandler(
      unknownError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Something went wrong",
    });
    expect(consoleSpy).toHaveBeenCalledWith("ERROR 💥", unknownError);
    consoleSpy.mockRestore();
  });

  it("should include stack trace in development environment", () => {
    process.env.NODE_ENV = "development";
    const appError = new AppError(400, "Test error");

    errorHandler(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Test error",
        stack: expect.any(String),
      })
    );
  });
});
