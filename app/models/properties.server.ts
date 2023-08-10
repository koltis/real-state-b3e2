import type { User, Property } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Note } from "@prisma/client";

export async function getProperty({ id }: { id: string }) {
  return await prisma.property.findUnique({
    where: { id },
    include: {
      agencyFee: true,
    },
  });
}

export async function deleteProperty({ id }: Pick<Property, "id">) {
  return await prisma.property.delete({ where: { id } });
}

export async function getUserProperties({ userId }: { userId: User["id"] }) {
  return await prisma.property.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function updateProperty({
  id,
  phone,
  country,
  address1,
  address2,
  cp,
  city,
  state,
  bedrooms,
  bathroom,
  garage,
  ownerPrice,
  title,
  size,
  description,
  geoCode,
}: Pick<
  Property,
  | "id"
  | "phone"
  | "country"
  | "address1"
  | "address2"
  | "cp"
  | "city"
  | "state"
  | "bedrooms"
  | "bathroom"
  | "garage"
  | "ownerPrice"
  | "title"
  | "size"
  | "description"
  | "geoCode"
>) {
  return await prisma.property.update({
    where: {
      id,
    },
    data: {
      phone,
      country,
      address1,
      address2,
      cp,
      city,
      state,
      bedrooms,
      bathroom,
      garage,
      ownerPrice,
      title,
      size,
      description,
      geoCode,
    },
  });
}

export async function createProperty({
  phone,
  country,
  address1,
  address2,
  cp,
  city,
  state,
  bedrooms,
  garage,
  ownerPrice,
  title,
  size,
  description,
  userId,
  bathroom,
  geoCode,
}: Pick<
  Property,
  | "phone"
  | "country"
  | "address1"
  | "address2"
  | "cp"
  | "city"
  | "state"
  | "bedrooms"
  | "garage"
  | "ownerPrice"
  | "title"
  | "size"
  | "description"
  | "userId"
  | "bathroom"
  | "geoCode"
>) {
  const agencyFeesId = await prisma.agencyFee.findFirst();

  return await prisma.property.create({
    data: {
      phone,
      country,
      address1,
      address2,
      cp,
      city,
      state,
      bedrooms,
      bathroom,
      garage,
      ownerPrice,
      title,
      size,
      description,
      agencyFeesId: agencyFeesId?.feeId,
      userId,
      geoCode,
    },
  });
}
