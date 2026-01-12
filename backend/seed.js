const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Category = require("./models/Category");
const Photography = require("./models/Photography");

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Demo photography data with Unsplash images
const demoPhotography = [
  {
    title: "Mountain Sunrise",
    description:
      "A breathtaking view of the sun rising over misty mountain peaks",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    category: "Landscape",
    dateTaken: new Date("2025-06-15"),
    isActive: true,
  },
  {
    title: "Urban Reflections",
    description: "City lights reflecting on rain-soaked streets at night",
    imageUrl:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200",
    category: "Street",
    dateTaken: new Date("2025-08-22"),
    isActive: true,
  },
  {
    title: "Portrait in Golden Hour",
    description: "Natural light portrait capturing the warmth of sunset",
    imageUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200",
    category: "Portrait",
    dateTaken: new Date("2025-09-10"),
    isActive: true,
  },
  {
    title: "Misty Forest Path",
    description: "An enchanting walkway through a fog-covered forest",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200",
    category: "Nature",
    dateTaken: new Date("2025-04-05"),
    isActive: true,
  },
  {
    title: "Ocean Waves at Dusk",
    description: "Powerful waves crashing against rocks during sunset",
    imageUrl:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200",
    category: "Landscape",
    dateTaken: new Date("2025-07-18"),
    isActive: true,
  },
  {
    title: "Quiet Contemplation",
    description: "A candid moment of reflection and peace",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200",
    category: "Portrait",
    dateTaken: new Date("2025-10-01"),
    isActive: true,
  },
  {
    title: "Starry Night Sky",
    description: "Long exposure capturing the beauty of the Milky Way",
    imageUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200",
    category: "Nature",
    dateTaken: new Date("2025-08-12"),
    isActive: true,
  },
  {
    title: "Street Life",
    description: "Capturing the essence of daily life in the city",
    imageUrl:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200",
    category: "Street",
    dateTaken: new Date("2025-05-20"),
    isActive: true,
  },
  {
    title: "Autumn Colors",
    description: "Vibrant fall foliage in the countryside",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
    category: "Nature",
    dateTaken: new Date("2025-11-03"),
    isActive: true,
  },
];

const seedAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (adminExists) {
      console.log("Admin user already exists");
    } else {
      // Create admin user
      const admin = await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL || "admin@artportfolio.com",
        password: process.env.ADMIN_PASSWORD || "Admin@123",
        role: "admin",
        bio: "Fine Art Artist specializing in Portrait Painting",
        artistStatement:
          "My art captures the essence of human emotion through portrait painting.",
      });
      console.log("Admin user created:", admin.email);
    }

    // Create default categories if they don't exist
    const defaultCategories = [
      {
        name: "Portrait",
        description: "Portrait paintings and drawings",
        order: 1,
      },
      {
        name: "Landscape",
        description: "Nature and landscape artwork",
        order: 2,
      },
      {
        name: "Abstract",
        description: "Abstract and contemporary pieces",
        order: 3,
      },
      { name: "Still Life", description: "Still life compositions", order: 4 },
      {
        name: "Competition Works",
        description: "Art competition entries and awards",
        order: 5,
      },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log("Category created:", cat.name);
      }
    }

    // Seed photography demo data
    const photoCount = await Photography.countDocuments();
    if (photoCount === 0) {
      console.log("Seeding photography demo data...");
      for (const photo of demoPhotography) {
        await Photography.create(photo);
        console.log("Photography created:", photo.title);
      }
    } else {
      console.log(`Photography already has ${photoCount} items, skipping seed`);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
};

seedAdmin();
