import { prisma } from "@/config";

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function updateRoom(roomId: number, capacity: number) {
  return prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      capacity,
    },
  });
}

const roomsRepository = {
  findRoomById,
  updateRoom,
};

export default roomsRepository;
