import bookingRepository from "@/repositories/booking-repository";
import { notFoundError, noVacancyError, paymentRequiredError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { TicketStatus } from "@prisma/client";
import roomsRepository from "@/repositories/room-repository";

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

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError;
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError;
  }

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError;
  }

  if (ticket.status === TicketStatus.RESERVED) {
    throw paymentRequiredError;
  }

  const verifyRoom = await roomsRepository.findRoomById(roomId);

  if (verifyRoom.capacity === 0) {
    throw noVacancyError;
  }
  //insert na booking
  const newBooking = await bookingRepository.insertBooking(userId, roomId);

  // update na room
  const room = await roomsRepository.findRoomById(roomId);
  const newCapacity = room.capacity - 1;

  await roomsRepository.updateRoom(roomId, newCapacity);

  return newBooking;
}

async function updateBooking(userId: number, roomId: number) {
  if (!roomId) {
    throw notFoundError;
  }

  const booking = await bookingRepository.findBookingWithUserId(userId);
  if (!booking) {
    throw notFoundError;
  }

  const newBooking = await bookingRepository.findFirstBookingsWithRoomId(roomId);

  if (newBooking.Room.capacity === 0) {
    throw noVacancyError;
  }

  // update old Room
  const newCapacityOldRoom = booking.Room.capacity + 1;
  const roomIdOldBooking = booking.Room.id;

  const oldRoomUpdated = await roomsRepository.updateRoom(roomIdOldBooking, newCapacityOldRoom);

  // newBooking
  //  update na room
  const newRoomCapacity = newBooking.Room.capacity - 1;
  const newRoomUpdated = await roomsRepository.updateRoom(roomId, newRoomCapacity);

  return newBooking;
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
