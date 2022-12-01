import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listBooking, postReservation, updateReservation } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", listBooking)
  .post("/", postReservation)
  .put("/:bookingId", updateReservation);

export { bookingRouter };
