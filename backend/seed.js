const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminExists) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      const admin = await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@artportfolio.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        bio: 'Fine Art Artist specializing in Portrait Painting',
        artistStatement: 'My art captures the essence of human emotion through portrait painting.',
      });
      console.log('Admin user created:', admin.email);
    }

    // Create default categories if they don't exist
    const defaultCategories = [
      { name: 'Portrait', description: 'Portrait paintings and drawings', order: 1 },
      { name: 'Landscape', description: 'Nature and landscape artwork', order: 2 },
      { name: 'Abstract', description: 'Abstract and contemporary pieces', order: 3 },
      { name: 'Still Life', description: 'Still life compositions', order: 4 },
      { name: 'Competition Works', description: 'Art competition entries and awards', order: 5 },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log('Category created:', cat.name);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
};

seedAdmin();
