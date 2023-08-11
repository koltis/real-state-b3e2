import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";

const prisma = new PrismaClient();

async function seed() {
  const email = "koltisb@gmail.com";

  // cleanup the existing database
  const deletedUser = await prisma.user
    .delete({ where: { email } })
    .catch(() => {
      // no worries if it doesn't exist yet
    });
  if (deletedUser) {
    await prisma.property
      .deleteMany({
        where: { userId: deletedUser.id },
      })
      .catch(() => {
        // no worries if it doesn't exist yet
      });
  }

  invariant(
    process.env.SEED_USER_PASSWORD,
    "The seed user must have a password",
  );

  const hashedPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD, 10);

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

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjpkM2U0ODgwMC0xNTRiLTQ1NjQtYjExZC01ZThkMWM3MDRmYTk",
      country: "es",
      address1: "Av. Juan Sebastián Elcano, 147, 29017 Málaga",
      cp: "29017",
      city: "malaga",
      state: "Málaga",
      bathroom: 2,
      bedrooms: 4,
      garage: false,
      ownerPrice: 150000,
      title:
        "Piso en venta en Av. Juan Sebastián Elcano, 147, 29017 Málaga - 4 habitaciones ",
      size: 150,
      description: `
      Agencia inmobiliaria de Málaga, Malaga Properties  zona Av. Juan Sebastián Elcano, vende piso SIN ASCENSOR para entrar a vivir:

      Consta de salón de paso, 3 dormitorios, TERRAZA, baño completo, cocina y pasillo distribuidor.

      Vivienda MUY LUMINOSA con orientación OESTE.

      Zona Av. Juan Sebastián Elcano, ideal para inversión debido al bajo precio por metro cuadrado y la alta demanda de alquiler por situación urbanística muy bien comunicada.

      Se encuentra localizada a 10 minutos del Hospital Carlos Haya, colegios a 5 minutos a pie, cerca de la zona universitaria y del Parque Norte Florida. Además encontraras todo tipo de servicios tales como supermercados, farmacias, centros comerciales, gimnasios, etc. , además de muy buena comunicación a través de Metro, líneas urbanas y líneas interurbanas de autobús.

      Nuestro departamento financiero realiza estudios sin compromiso con posibilidad de financiación hasta el 100%. Para más información, póngase en contacto con nosotros a través de este anuncio.

      EL PRECIO DE VENTA DEL INMUEBLE AQUÍ EXPUESTO INCLUYE LOS HONORARIOS DE INTERMEDIACIÓN INMOBILIARIA y LOS GASTOS RELACIONADOS CON DICHA COMPRA`,

      imgs: {
        create: {
          url: "https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/1463aa3e-bff0-4e6c-e4c9-4ba548583900/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjplNDVhZjAwYy0wODZkLTQxMWQtYTExYy1mZWZmMmM1ZGU5YTU",
      country: "es",
      address1: "Cmo de S. Rafael, 55, 29006 Málaga",
      cp: "29006",
      city: "malaga",
      state: "Málaga",
      bathroom: 1,
      bedrooms: 5,
      garage: true,
      ownerPrice: 210000,
      title: "casa en Calle, Cmo de S. Rafael, 55, 29006 Málaga",
      size: 200,
      description: ` 
      casa en casa en Calle, Cmo de S. Rafael, 55, 29006 Málaga
      `,
      imgs: {
        create: {
          url: " https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/b4690069-1c5c-49f2-ad41-f90f31f51d00/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjozOTVmZDU4My1jZDc5LTRhMWEtOThkYS03Mzk1MjI2ZGQyZDc",
      country: "es",
      address1: "Avenida De María Zambrano 7",
      cp: "29651",
      city: "malaga",
      state: "Málaga",
      bathroom: 3,
      bedrooms: 5,
      garage: false,
      ownerPrice: 1050000,
      title: "Mcdonals en venta en Avenida De María Zambrano ",
      size: 180,
      description: `
      ¡Oportunidad Única! McDonald's en Venta en Av. María Zambrano, Málaga

      Te presentamos una increíble oportunidad de inversión en una de las ubicaciones más estratégicas de Málaga. Este espacioso y moderno McDonald's está situado en la prestigiosa Av. María Zambrano, ofreciendo una gran visibilidad y accesibilidad para residentes locales y turistas por igual.

      Características Principales:

      Ubicación Ideal: Av. María Zambrano es una de las arterias más transitadas de Málaga, lo que garantiza una alta afluencia de clientes potenciales.
      Amplio Espacio: Con un tamaño de 180 metros cuadrados, este McDonald's ofrece un amplio espacio para acomodar a los clientes cómodamente.
      Cinco Habitaciones`,
      imgs: {
        create: {
          url: "https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/e88b49df-3385-4f1d-d77c-4db973776f00/public",
          alt: "mcdonalds",
          position: 1,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjplNjkzZWIwOC0xMmE3LTQ5NjMtYTU2MS02NjMwNjllYTZiODc",
      country: "es",
      address1: "Av. de Velázquez, 241, 29004 Málaga",
      cp: "29004",
      city: "malaga",
      state: "Málaga",
      bathroom: 3,
      bedrooms: 1,
      garage: true,
      ownerPrice: 242130,
      title: "casa en Calle, Av. de Velázquez, 241, 29004 Málaga",
      size: 200,
      description: ` 
      casa en casa en Calle, Av. de Velázquez, 241, 29004 Málaga
      `,
      imgs: {
        create: {
          url: " https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/a252f32f-de87-4e98-524d-45820ca7d600/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });
  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjphYjVkYmMzZS1iM2IwLTQ5MDctYjE3OS05NDFhMDQ3ZjU5NTY",
      country: "es",
      address1: "C. Eduardo Marquina, 10, 29002 Málaga",
      cp: "29002",
      city: "malaga",
      state: "Málaga",
      bathroom: 6,
      bedrooms: 2,
      garage: true,
      ownerPrice: 332130,
      title: "casa en C. Eduardo Marquina, 10, 29002 Málaga",
      size: 220,
      description: ` 
      casa en C. Eduardo Marquina, 10, 29002 Málaga
      `,
      imgs: {
        create: {
          url: " https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/19626da2-8e35-44ac-ecd4-124a3a75fc00/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });
  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjozMjRjNTg5Yi05ZmQ0LTQ0ODctYjRkNS02ZjJjNGM4ZDcxZGQ",
      country: "es",
      address1: "Av. de Velázquez, 43, 29003 Málaga",
      cp: "29003",
      city: "malaga",
      state: "Málaga",
      bathroom: 7,
      bedrooms: 4,
      garage: true,
      ownerPrice: 412130,
      title: "casa en Av. de Velázquez, 43, 29003 Málaga",
      size: 320,
      description: ` 
      casa en Av. de Velázquez, 43, 29003 Málaga
      `,
      imgs: {
        create: {
          url: " https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/e3d2e612-84ef-49a5-cee5-41fcb7f63d00/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjpjZGE2ZDA3ZS0yNWQ5LTQzN2UtODk4Mi01ZjVhZDQ2MDU0MjI",
      country: "es",
      address1: "C. Martínez Maldonado, 6, 29007 Málaga",
      cp: "29007",
      city: "malaga",
      state: "Málaga",
      bathroom: 1,
      bedrooms: 2,
      garage: false,
      ownerPrice: 212130,
      title: "casa en C. Martínez Maldonado, 6, 29007 Málaga",
      size: 180,
      description: ` 
      casa en C. Martínez Maldonado, 6, 29007 Málaga
      `,
      imgs: {
        create: {
          url: " https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/0e4aa5d5-965f-4a0e-3e18-b4025f88a200/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjphZmY1YzdiMy1jNjQ4LTQzODAtODJhMi02ZTRiYzBlODk5Yjk",
      country: "es",
      address1: "C. Emilio Thuillier, 2, 29014 Málaga",
      cp: "29014",
      city: "malaga",
      state: "Málaga",
      bathroom: 2,
      bedrooms: 4,
      garage: true,
      ownerPrice: 272130,
      title: "casa en C. Emilio Thuillier, 2, 29014 Málaga",
      size: 180,
      description: ` 
      casa en C. Emilio Thuillier, 2, 29014 Málaga
      `,
      imgs: {
        create: {
          url: " https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/47eb755b-cdcf-44df-b178-6c8fd4088100/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      userId: user.id,
      phone: "623144819",
      geoCode:
        "dXJuOm1ieGFkcjpiZDQ1MzQzNi1mNmNlLTQ1MjQtODY0Ny1kNjU2YmZmOGM2Y2I",
      country: "es",
      address1: "C/ Píndaro, C/ Aristófanes, s/n, 29010 Málaga",
      cp: "29010",
      city: "malaga",
      state: "Málaga",
      bathroom: 1,
      bedrooms: 2,
      garage: false,
      ownerPrice: 173130,
      title: "C/ Píndaro, C/ Aristófanes, s/n, 29010 Málaga",
      size: 120,
      description: ` 
      C/ Píndaro, C/ Aristófanes, s/n, 29010 Málaga
      `,
      imgs: {
        create: {
          url: " https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/bd00968c-0b24-4c1d-6ff3-894cbbcbeb00/public",
          alt: " facade of a modern house",
          position: 1,
        },
      },
    },
  });

  // await prisma.propertyImg.create({
  //   data: {
  //     url: "https://imagedelivery.net/xtrfEdMVPyUA4dlPxWzvNw/1463aa3e-bff0-4e6c-e4c9-4ba548583900/public",
  //     alt: " facade of a modern house",
  //     position: 1,
  //     propertyId: property.id,
  //   },
  // });

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
