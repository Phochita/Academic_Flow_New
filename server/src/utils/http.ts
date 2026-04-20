import zod = require("zod");

const { ZodError } = zod;
type ZodErrorInstance = InstanceType<typeof ZodError>;

class HttpError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

const assert = (condition: unknown, statusCode: number, message: string, details?: unknown) => {
  if (!condition) {
    throw new HttpError(statusCode, message, details);
  }
};

const parsePositiveInteger = (value: unknown, fieldName: string) => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw new HttpError(400, `Invalid ${fieldName}. Expected a positive integer.`);
  }

  return numericValue;
};

const parseOptionalPositiveInteger = (value: unknown, fieldName: string) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parsePositiveInteger(value, fieldName);
};

const parseDateOnly = (value: unknown, fieldName: string) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new HttpError(400, `Invalid ${fieldName}. Expected YYYY-MM-DD.`);
  }

  return value;
};

const isHttpError = (error: unknown): error is HttpError => error instanceof HttpError;
const isZodError = (error: unknown): error is ZodErrorInstance => error instanceof ZodError;

export = {
  HttpError,
  assert,
  isHttpError,
  isZodError,
  parseDateOnly,
  parseOptionalPositiveInteger,
  parsePositiveInteger,
};
