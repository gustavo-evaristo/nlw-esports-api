import { PrismaClient } from '@prisma/client';

export const {
	game,
	ad
} = new PrismaClient();