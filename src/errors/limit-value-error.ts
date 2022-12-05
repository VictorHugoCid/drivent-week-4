import { ApplicationError } from "@/protocols";

export function limitValueError(message: string): ApplicationError {
  return {
    name: "limitValueError",
    message,
  };
}
