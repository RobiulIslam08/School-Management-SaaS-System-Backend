export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errors: FieldError[] | null;

  constructor(statusCode: number, message: string, errors: FieldError[] | null = null) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
