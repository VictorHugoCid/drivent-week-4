import { prisma } from "@/config";

async function findBookingWithUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: { Room: true },
  });
}

async function findFirstBookingsWithRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId,
    },
    include: { Room: true },
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
  findFirstBookingsWithRoomId,
  insertBooking,
};

export default bookingRepository;
