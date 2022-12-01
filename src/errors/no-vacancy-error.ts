import { ApplicationError } from "@/protocols";

export function noVacancyError(): ApplicationError {
  return {
    name: "noVacancyError",
    message: "This rooms is no longer available",
  };
}
