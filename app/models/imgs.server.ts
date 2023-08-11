import { prisma } from "~/db.server";

export async function createImg({
  url,
  propertyId,
  alt,
  position = 1,
}: {
  url: string;
  propertyId: string;
  alt: string;
  position?: number;
}) {
  return await prisma.propertyImg.create({
    data: {
      alt,
      position,
      propertyId,
      url,
    },
  });
}
