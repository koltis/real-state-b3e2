import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "koltisb@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("koltisb@gmail.com", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const agencyFee = await prisma.agencyFees.create({
    data: {
      fee: 3,
    },
  });

  await prisma.agencyFee.create({
    data: {
      feeId: agencyFee.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      country: "spain",
      address1: "Av. Santa Rosa de Lima, 20",
      cp: "29007",
      city: "malaga",
      state: "andalucia",
      bathroom: 2,
      bedrooms: 4,
      garage: false,
      ownerPrice: 150000,
      title: "Piso en venta en Rosa de Lima - 20 - 4 habitaciones ",
      size: 150,
      description: `
      Agencia inmobiliaria de Málaga, Malaga Properties  zona rosa de lima, vende piso SIN ASCENSOR para entrar a vivir:

      Consta de salón de paso, 3 dormitorios, TERRAZA, baño completo, cocina y pasillo distribuidor.

      Vivienda MUY LUMINOSA con orientación OESTE.

      Zona rosa de lima, ideal para inversión debido al bajo precio por metro cuadrado y la alta demanda de alquiler por situación urbanística muy bien comunicada.

      Se encuentra localizada a 10 minutos del Hospital Carlos Haya, colegios a 5 minutos a pie, cerca de la zona universitaria y del Parque Norte Florida. Además encontraras todo tipo de servicios tales como supermercados, farmacias, centros comerciales, gimnasios, etc. , además de muy buena comunicación a través de Metro, líneas urbanas y líneas interurbanas de autobús.

      Nuestro departamento financiero realiza estudios sin compromiso con posibilidad de financiación hasta el 100%. Para más información, póngase en contacto con nosotros a través de este anuncio.

      EL PRECIO DE VENTA DEL INMUEBLE AQUÍ EXPUESTO INCLUYE LOS HONORARIOS DE INTERMEDIACIÓN INMOBILIARIA y LOS GASTOS RELACIONADOS CON DICHA COMPRA`,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
