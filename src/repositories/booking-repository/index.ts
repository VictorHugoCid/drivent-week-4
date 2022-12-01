import { prisma } from "@/config";

async function findBookingWithUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: { Room: true },
  });
}

async function findManyBookingsWithRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function insertBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
const bookingRepository = {
  findBookingWithUserId,
  findManyBookingsWithRoomId,
  insertBooking,
};

export default bookingRepository;
