import { ApplicationError } from "@/protocols";

export function paymentRequiredError(): ApplicationError {
  return {
    name: "paymentRequired",
    message: "Payment Required",
  };
}
