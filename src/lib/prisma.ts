import { PrismaClient } from "@/generated/prisma/client";

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  if (typeof window !== "undefined") return null;
  if (!process.env.DATABASE_URL) return null;
  
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({} as any);
  }
  return prismaInstance;
}
