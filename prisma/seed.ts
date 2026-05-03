import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL ve ADMIN_PASSWORD tanımlı olmalı.");
  }

  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Admin",
      role: UserRole.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      role: UserRole.ADMIN,
    },
  });

  const amenities = [
    { name: "WiFi", icon: "wifi" },
    { name: "Havuz", icon: "pool" },
    { name: "Klima", icon: "snowflake" },
    { name: "Otopark", icon: "car" },
    { name: "Deniz Manzarası", icon: "waves" },
    { name: "Barbekü", icon: "flame" },
    { name: "Jakuzi", icon: "bath" },
    { name: "Bahçe", icon: "trees" },
    { name: "Açık hava duşu", icon: "shower" },
    { name: "Açık hava yemek alanı", icon: "utensils" },
    { name: "Bahçe mobilyaları", icon: "chair" },
    { name: "Bahçe şöminesi", icon: "fireplace" },
    { name: "Beşik", icon: "baby" },
    { name: "Bulaşık makinesi", icon: "dishwasher" },
    { name: "Buzdolabı", icon: "fridge" },
    { name: "Dondurucu", icon: "snowflake" },
    { name: "Duman dedektörü", icon: "smoke" },
    { name: "Ekmek kızartma makinesi", icon: "toast" },
    { name: "Elbise askıları", icon: "hanger" },
    { name: "Fazladan yastık ve battaniye", icon: "bed" },
    { name: "Fırın", icon: "oven" },
    { name: "Fırın tepsisi", icon: "tray" },
    { name: "Giysi dolabı", icon: "wardrobe" },
    { name: "Isıtma", icon: "heater" },
    { name: "Karartma perdeleri", icon: "blinds" },
    { name: "İlk yardım çantası", icon: "first-aid" },
    { name: "Kahve makinesi", icon: "coffee" },
    { name: "Kasa", icon: "safe" },
    { name: "Mama sandalyesi", icon: "highchair" },
    { name: "Mangal malzemeleri", icon: "grill" },
    { name: "Mutfak", icon: "kitchen" },
    { name: "Ocak", icon: "stove" },
    { name: "Park yatak", icon: "crib" },
    { name: "Saç kurutma makinesi", icon: "dryer" },
    { name: "Sineklik", icon: "window" },
    { name: "Sokakta ücretsiz otopark", icon: "parking" },
    { name: "Su ısıtıcısı", icon: "kettle" },
    { name: "Sıcak su", icon: "water" },
    { name: "Temel malzemeler", icon: "essentials" },
    { name: "TV", icon: "tv" },
    { name: "Uzun süreli konaklama", icon: "calendar" },
    { name: "Veranda veya balkon", icon: "balcony" },
    { name: "Yangın söndürücü", icon: "extinguisher" },
    { name: "Yatak çarşafları", icon: "bedsheet" },
    { name: "Yemek masası", icon: "table" },
    { name: "Yemek pişirme malzemeleri", icon: "cookware" },
    { name: "Yemek takımı", icon: "cutlery" },
    { name: "Çamaşır asma yeri", icon: "hanger" },
    { name: "Çamaşır makinesi", icon: "washing-machine" },
    { name: "Özel giriş", icon: "door" },
    { name: "Özel çalışma alanı", icon: "desk" },
    { name: "Ütü", icon: "iron" },
    { name: "Şarap kadehleri", icon: "wine" },
    { name: "Şezlonglar", icon: "sunbed" },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {
        icon: amenity.icon,
      },
      create: amenity,
    });
  }

  const wifi = await prisma.amenity.findUnique({
    where: { name: "WiFi" },
  });

  const pool = await prisma.amenity.findUnique({
    where: { name: "Havuz" },
  });

  const listing = await prisma.listing.upsert({
    where: { slug: "sea-view-villa" },
    update: {},
    create: {
      slug: "sea-view-villa",
      title: "Sea View Villa",
      shortDescription: "Deniz manzaralı modern villa",
      description:
        "Geniş terası ve modern mimarisiyle konforlu bir konaklama deneyimi sunar.",
      city: "Muğla",
      district: "Bodrum",
      guestCapacity: 6,
      bedroomCount: 3,
      bedCount: 4,
      bathroomCount: 2,
      basePrice: "6500.00",
      cleaningFee: "1500.00",
      isActive: true,
    },
  });

  const existingImage = await prisma.listingImage.findFirst({
    where: {
      listingId: listing.id,
      url: "/images/hero.png",
    },
  });

  if (!existingImage) {
    await prisma.listingImage.create({
      data: {
        listingId: listing.id,
        url: "/images/hero.png",
        alt: "Sea View Villa",
        sortOrder: 1,
        isCover: true,
      },
    });
  }

  if (wifi && pool) {
    await prisma.listingAmenityRel.createMany({
      data: [
        { listingId: listing.id, amenityId: wifi.id },
        { listingId: listing.id, amenityId: pool.id },
      ],
      skipDuplicates: true,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
