import bookingRepository from "@/repositories/booking-repository";
import { notFoundError, paymentRequiredError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { TicketStatus } from "@prisma/client";

async function getBooking(userId: number) {
  const searchBooking = await bookingRepository.findBookingWithUserId(userId);

  if (!searchBooking) {
    throw notFoundError;
  }
  const booking = {
    id: searchBooking.id,
    Room: { ...searchBooking.Room },
  };

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  if (!roomId) {
    throw notFoundError;
  }

  const newBooking = await bookingRepository.insertBooking(userId, roomId);

  return newBooking;
}

async function updateBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError;
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  console.log("🚀🚀🚀 ~ file: index.ts:40 ~ updateBooking ~ ticket", ticket);

  if (!ticket) {
    console.log("CAIU NO no ticket");
    throw notFoundError;
  }

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    console.log("CAIU NO CANNOT LIST HOTELS");
    throw cannotListHotelsError;
  }

  if (ticket.status === TicketStatus.RESERVED) {
    console.log("CAIU NO payment");
    throw paymentRequiredError;
  }

  const bookings = await bookingRepository.findManyBookingsWithRoomId(roomId);

  if (!bookings) {
    throw notFoundError;
  }

  return bookings;
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
