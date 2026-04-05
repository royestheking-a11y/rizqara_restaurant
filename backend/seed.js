require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const models = require('./models');

cloudinary.config({
  cloud_name: 'dajfn1uif',
  api_key: '411768171972811',
  api_secret: 'hhaPMB0YSLz9fK71uVTT-juNWTg'
});

const uploadToCloudinary = async (url) => {
  if (!url) return url;
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'rizqara_restaurant'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', url, error);
    return url; // fallback to original
  }
};

const menuItems = [
  {
    name: 'Kacchi Biryani', slug: 'kacchi-biryani', category: 'Biryani', price: 350,
    image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZSUyMHNhZmZyb24lMjBzcGljZWR8ZW58MXx8fHwxNzc1MDU4NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A royal delicacy made with tender mutton and fragrant basmati rice, slow-cooked with exotic spices and saffron. A true Barishal tradition prepared the authentic way.',
    ingredients: ['Basmati Rice', 'Mutton', 'Saffron', 'Ghee', 'Onions', 'Yogurt', 'Cardamom', 'Cinnamon', 'Bay Leaves', 'Potatoes'],
    nutrition: { calories: 680, protein: '38g', carbs: '72g', fat: '22g' },
    spiceLevel: 'Medium', rating: 4.9, reviewCount: 342,
    isVeg: false, isSpicy: true, isPopular: true, prepTime: '45 min', serves: '1 Person',
  },
  {
    name: 'Chicken BBQ', slug: 'chicken-bbq', category: 'Kebab', price: 280,
    image: 'https://images.unsplash.com/photo-1592011432621-f7f576f44484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwQkJRJTIwZ3JpbGxlZHxlbnwxfHx8fDE3NzUwNTg0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Juicy whole chicken marinated in special BBQ sauce and slow-grilled over charcoal. Perfectly crispy skin with smoky, tender meat inside.',
    ingredients: ['Whole Chicken', 'BBQ Sauce', 'Garlic', 'Ginger', 'Lemon', 'Mixed Spices', 'Olive Oil', 'Herbs'],
    nutrition: { calories: 520, protein: '48g', carbs: '12g', fat: '28g' },
    spiceLevel: 'Medium', rating: 4.8, reviewCount: 218,
    isVeg: false, isSpicy: false, isPopular: true, prepTime: '35 min', serves: '2 Persons',
  },
  {
    name: 'Thai Soup', slug: 'thai-soup', category: 'Thai', price: 180,
    image: 'https://images.unsplash.com/photo-1585417791023-a5a6164b2646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwc291cCUyMG5vb2RsZXMlMjBib3dsfGVufDF8fHx8MTc3NTA1ODQyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Authentic Thai-style soup with rice noodles, fresh vegetables, and aromatic coconut broth. A perfect balance of sweet, sour, and spicy flavors.',
    ingredients: ['Rice Noodles', 'Coconut Milk', 'Lemongrass', 'Galangal', 'Kaffir Lime', 'Mushrooms', 'Bean Sprouts', 'Chili'],
    nutrition: { calories: 320, protein: '14g', carbs: '48g', fat: '10g' },
    spiceLevel: 'Hot', rating: 4.7, reviewCount: 156,
    isVeg: true, isSpicy: true, isPopular: true, prepTime: '20 min', serves: '1 Person',
  },
  {
    name: 'Beef Kebab', slug: 'beef-kebab', category: 'Kebab', price: 320,
    image: 'https://images.unsplash.com/photo-1577367997065-fdd8fd94fb3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwa2ViYWIlMjBza2V3ZXIlMjBncmlsbGVkfGVufDF8fHx8MTc3NTA1ODQyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium beef kebabs skewered and grilled to perfection. Seasoned with aromatic Middle Eastern spices and served with fresh mint chutney.',
    ingredients: ['Beef Mince', 'Onion', 'Garlic', 'Ginger', 'Mixed Spices', 'Coriander', 'Mint', 'Green Chili'],
    nutrition: { calories: 450, protein: '42g', carbs: '8g', fat: '26g' },
    spiceLevel: 'Medium', rating: 4.8, reviewCount: 198,
    isVeg: false, isSpicy: true, isPopular: true, prepTime: '25 min', serves: '1 Person',
  },
  {
    name: 'Fried Rice', slug: 'fried-rice', category: 'Chinese', price: 220,
    image: 'https://images.unsplash.com/photo-1601226809638-4ab838bb4d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjB3b2slMjBhc2lhbiUyMGN1aXNpbmV8ZW58MXx8fHwxNzc1MDU4NDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Wok-tossed egg fried rice with mixed vegetables and a secret blend of sauces. A classic Chinese comfort food with the perfect smoky wok flavor.',
    ingredients: ['Basmati Rice', 'Eggs', 'Mixed Vegetables', 'Soy Sauce', 'Oyster Sauce', 'Sesame Oil', 'Spring Onion', 'Garlic'],
    nutrition: { calories: 380, protein: '12g', carbs: '65g', fat: '8g' },
    spiceLevel: 'Mild', rating: 4.6, reviewCount: 189,
    isVeg: false, isSpicy: false, isPopular: false, prepTime: '15 min', serves: '1 Person',
  },
  {
    name: 'Grill Chicken', slug: 'grill-chicken', category: 'Kebab', price: 260,
    image: 'https://images.unsplash.com/photo-1759568558640-3c9239a6153e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwd2hvbGUlMjBjaGlja2VuJTIwcm90aXNzZXJpZXxlbnwxfHx8fDE3NzUwNTg0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium whole chicken marinated in signature herbs and spices, slow-grilled for tenderness. Served with garlic butter rice and grilled vegetables.',
    ingredients: ['Whole Chicken', 'Herbs', 'Garlic', 'Butter', 'Lemon', 'Paprika', 'Rosemary', 'Thyme'],
    nutrition: { calories: 490, protein: '52g', carbs: '4g', fat: '24g' },
    spiceLevel: 'Mild', rating: 4.7, reviewCount: 145,
    isVeg: false, isSpicy: false, isPopular: true, prepTime: '40 min', serves: '2 Persons',
  },
  {
    name: 'BBQ Platter', slug: 'bbq-platter', category: 'Kebab', price: 550,
    image: 'https://images.unsplash.com/photo-1722554085769-8ad416331d48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCQlElMjBwbGF0dGVyJTIwbWl4ZWQlMjBncmlsbCUyMHBsYXR0ZXJ8ZW58MXx8fHwxNzc1MDU4NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A royal feast platter featuring mixed BBQ meats — chicken, beef, lamb chops and seekh kebab. Perfect for sharing and celebrating.',
    ingredients: ['Chicken', 'Beef', 'Lamb', 'Seekh Kebab', 'BBQ Sauce', 'Mixed Spices', 'Grilled Vegetables', 'Naan'],
    nutrition: { calories: 1200, protein: '95g', carbs: '32g', fat: '72g' },
    spiceLevel: 'Medium', rating: 4.9, reviewCount: 267,
    isVeg: false, isSpicy: false, isPopular: true, prepTime: '50 min', serves: '3-4 Persons',
  },
  {
    name: 'Special Set Menu', slug: 'special-set-menu', category: 'Indian', price: 480,
    image: 'https://images.unsplash.com/photo-1515668236457-83c3b8764839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsJTIwc2V0JTIwbWVudSUyMHByZW1pdW0lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NzUwNTg0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: "Chef's special set menu with a curated selection of our finest dishes. Includes soup, main course, dessert, and a refreshing drink. The ultimate dining experience.",
    ingredients: ['Soup', 'Biryani', 'Chicken Curry', 'Naan', 'Salad', 'Dessert', 'Drink'],
    nutrition: { calories: 950, protein: '55g', carbs: '120g', fat: '32g' },
    spiceLevel: 'Medium', rating: 4.9, reviewCount: 198,
    isVeg: false, isSpicy: false, isPopular: true, prepTime: '30 min', serves: '1 Person',
  },
  {
    name: 'Mango Lassi', slug: 'mango-lassi', category: 'Drinks', price: 80,
    image: 'https://images.unsplash.com/photo-1762880343746-f9cbfeed9fe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZyZXNoaW5nJTIwdHJvcGljYWwlMjBkcmlua3MlMjBjb2NrdGFpbHMlMjBtb2NrdGFpbHN8ZW58MXx8fHwxNzc1MDU4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Chilled and creamy mango lassi made with fresh Alphonso mangoes, thick yogurt, and a hint of cardamom. The perfect drink to complement your meal.',
    ingredients: ['Mango', 'Yogurt', 'Milk', 'Sugar', 'Cardamom', 'Ice'],
    nutrition: { calories: 180, protein: '6g', carbs: '32g', fat: '4g' },
    spiceLevel: 'Mild', rating: 4.7, reviewCount: 123,
    isVeg: true, isSpicy: false, isPopular: false, prepTime: '5 min', serves: '1 Person',
  },
  {
    name: 'Chocolate Lava Cake', slug: 'chocolate-lava-cake', category: 'Dessert', price: 150,
    image: 'https://images.unsplash.com/photo-1688458296817-3f9c4fba4809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2hvY29sYXRlJTIwY2FrZSUyMHByZW1pdW0lMjBwbGF0aW5nfGVufDF8fHx8MTc3NTA1ODQzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Decadent warm chocolate cake with a flowing molten center, served with vanilla ice cream and raspberry coulis. A heavenly dessert experience.',
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla', 'Raspberry Coulis', 'Vanilla Ice Cream'],
    nutrition: { calories: 480, protein: '8g', carbs: '58g', fat: '26g' },
    spiceLevel: 'Mild', rating: 4.8, reviewCount: 201,
    isVeg: true, isSpicy: false, isPopular: false, prepTime: '20 min', serves: '1 Person',
  },
  {
    name: 'Chicken Tikka Masala', slug: 'chicken-tikka-masala', category: 'Indian', price: 300,
    image: 'https://images.unsplash.com/photo-1770678724756-dc8e5123305b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBob3RvZ3JhcGh5JTIwc3ByZWFkJTIwdGFibGV8ZW58MXx8fHwxNzc1MDU4NDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Succulent tandoori chicken pieces simmered in a rich, creamy tomato-based masala sauce. Served with garlic naan and basmati rice.',
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Onions', 'Garlic', 'Ginger', 'Tikka Masala Spices', 'Kashmiri Chili'],
    nutrition: { calories: 560, protein: '45g', carbs: '28g', fat: '28g' },
    spiceLevel: 'Hot', rating: 4.8, reviewCount: 176,
    isVeg: false, isSpicy: true, isPopular: true, prepTime: '30 min', serves: '1 Person',
  },
  {
    name: 'Pad Thai', slug: 'pad-thai', category: 'Thai', price: 240,
    image: 'https://images.unsplash.com/photo-1585417791023-a5a6164b2646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwc291cCUyMG5vb2RsZXMlMjBib3dsfGVufDF8fHx8MTc3NTA1ODQyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Classic Thai stir-fried rice noodles with shrimp, bean sprouts, eggs, and roasted peanuts in a tangy tamarind-based sauce.',
    ingredients: ['Rice Noodles', 'Shrimp', 'Eggs', 'Bean Sprouts', 'Peanuts', 'Tamarind', 'Fish Sauce', 'Lime'],
    nutrition: { calories: 420, protein: '24g', carbs: '58g', fat: '12g' },
    spiceLevel: 'Medium', rating: 4.6, reviewCount: 132,
    isVeg: false, isSpicy: true, isPopular: false, prepTime: '20 min', serves: '1 Person',
  }
];

const chefs = [
  { name: 'Chef Rahman', position: 'Head Chef & Culinary Director', experience: '15+ Years', speciality: 'BBQ & Mughlai Cuisine', image: 'https://images.unsplash.com/photo-1724451344572-6d71e6823638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwbWFuJTIwY29va2luZyUyMGtpdGNoZW4lMjB1bmlmb3JtfGVufDF8fHx8MTc3NTA1ODQzM3ww&ixlib=rb-4.1.0&q=80&w=1080', bio: 'Chef Rahman trained at the Culinary Institute of Bangladesh and honed his skills in Dubai and Singapore. He brings 15 years of mastery in BBQ and Mughlai cuisine to Rizqara.' },
  { name: 'Chef Priya Das', position: 'Senior Chef — Asian Cuisine', experience: '10+ Years', speciality: 'Thai & Chinese Cuisine', image: 'https://images.unsplash.com/photo-1767818375700-ff0a9cab8f13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBjaGVmJTIwc21pbGluZyUyMHJlc3RhdXJhbnQlMjBraXRjaGVufGVufDF8fHx8MTc3NTA1ODQzM3ww&ixlib=rb-4.1.0&q=80&w=1080', bio: 'Chef Priya is a graduate of Bangkok Culinary School with specialization in Thai and Chinese cuisine. Her dishes are a harmonious blend of tradition and modern technique.' },
  { name: 'Chef Arif Hossain', position: 'Pastry & Dessert Chef', experience: '8+ Years', speciality: 'Desserts & Continental', image: 'https://images.unsplash.com/photo-1635139883265-2fe4bccce747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBjaGVmJTIwcmVzdGF1cmFudCUyMHdoaXRlJTIwdW5pZm9ybSUyMHNtaWxpbmd8ZW58MXx8fHwxNzc1MDU4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080', bio: 'Chef Arif is a passionate pastry artist with a talent for creating stunning desserts. Trained in Paris, he brings French techniques to Bangladeshi flavors with extraordinary results.' }
];

const reviews = [
  { name: 'Md. Farhan Islam', rating: 5, comment: 'Absolutely the best restaurant in Barishal! The Kacchi Biryani was heavenly — rich, aromatic, and perfectly cooked. The ambiance is top-notch and service is impeccable. I bring every guest here.', date: '2026-03-20', location: 'Barishal, Bangladesh' },
  { name: 'Sultana Razia', rating: 5, comment: 'Rizqara never disappoints! We celebrated our anniversary here and the staff went above and beyond. The BBQ Platter was phenomenal. This place is truly world-class for Barishal.', date: '2026-03-15', location: 'Dhaka, Bangladesh' },
  { name: 'Karim Uddin', rating: 5, comment: "I've dined in restaurants across Bangladesh, but Rizqara stands out. The Special Set Menu is exceptional value. Chef Rahman's cooking is on a completely different level!", date: '2026-03-10', location: 'Khulna, Bangladesh' },
  { name: 'Nasrin Akter', rating: 4, comment: 'Beautiful restaurant, stunning decor and amazing food. The Thai Soup was authentic and packed with flavor. The staff is very professional and attentive. Will visit again soon!', date: '2026-02-28', location: 'Barishal, Bangladesh' },
  { name: 'Tanvir Ahmed', rating: 5, comment: "Rizqara has completely changed my dining expectations. The beef kebabs are the best I've ever had — tender, flavorful, and perfectly spiced. A truly supreme restaurant!", date: '2026-02-20', location: 'Chittagong, Bangladesh' }
];

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1768697358705-c1b60333da35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50JTIwZGluaW5nfGVufDF8fHx8MTc3NTA1MzEzNHww&ixlib=rb-4.1.0&q=80&w=1080', category: 'Restaurant', title: 'Elegant Dining Hall' },
  { url: 'https://images.unsplash.com/photo-1770678724756-dc8e5123305b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMHBob3RvZ3JhcGh5JTIwc3ByZWFkJTIwdGFibGV8ZW58MXx8fHwxNzc1MDU4NDM0fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Food', title: 'Signature Food Spread' },
  { url: 'https://images.unsplash.com/photo-1763429338698-439aa108e7fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZXZlbnQlMjBjZWxlYnJhdGlvbiUyMGhhbGwlMjBzZXR1cHxlbnwxfHx8fDE3NzUwNTg0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Events', title: 'Grand Event Setup' },
  { url: 'https://images.unsplash.com/photo-1759805583291-704d7af07682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwcmVzdGF1cmFudCUyMG91dGRvb3IlMjB0ZXJyYWNlJTIwZGluaW5nJTIwbmlnaHR8ZW58MXx8fHwxNzc1MDU4NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Restaurant', title: 'Outdoor Terrace Dining' },
  { url: 'https://images.unsplash.com/photo-1767785990437-dfe1fe516fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGNoZWYlMjBjb29raW5nJTIwdGVhbXxlbnwxfHx8fDE3NzUwNTg0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Kitchen', title: "Chef's Kitchen in Action" },
  { url: 'https://images.unsplash.com/photo-1688458296817-3f9c4fba4809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2hvY29sYXRlJTIwY2FrZSUyMHByZW1pdW0lMjBwbGF0aW5nfGVufDF8fHx8MTc3NTA1ODQzNXww&ixlib=rb-4.1.0&q=80&w=1080', category: 'Food', title: 'Premium Dessert Art' },
  { url: 'https://images.unsplash.com/photo-1713375094006-5a0d705a2c8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwYWJvdXQlMjBlbGVnYW50JTIwaW50ZXJpb3IlMjB3YXJtJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzc1MDU4NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Restaurant', title: 'Warm Ambient Lighting' },
  { url: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZSUyMHNhZmZyb24lMjBzcGljZWR8ZW58MXx8fHwxNzc1MDU4NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080', category: 'Food', title: 'Kacchi Biryani Royale' }
];

const cateringPackages = [
  { name: 'Silver Package', price: '৳25,000', serves: '50-100 Guests', features: ['3 Main Course Items', 'Rice & Bread Selection', '2 Dessert Items', 'Basic Decoration', 'Serving Staff (2)', 'Setup & Cleanup'], popular: false, color: '#9CA3AF' },
  { name: 'Gold Package', price: '৳50,000', serves: '100-200 Guests', features: ['5 Main Course Items', 'Full Rice & Bread Menu', '3 Starters', '3 Dessert Items', 'Premium Decoration', 'Serving Staff (5)', 'Live BBQ Station', 'Setup & Cleanup'], popular: true, color: '#D4AF37' },
  { name: 'Premium Package', price: '৳1,00,000', serves: '200-500 Guests', features: ['8 Main Course Items', 'Full Buffet Menu', '5 Live Stations', '5 Dessert Items', 'Royal Decoration', 'Full Event Management', 'Photography Included', 'Serving Staff (12)', 'Custom Menu Design', 'VIP Setup & Cleanup'], popular: false, color: '#6B0F0F' }
];

const carouselSlides = [
  { url: 'https://images.unsplash.com/photo-1768697358705-c1b60333da35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBlbGVnYW50JTIwZGluaW5nfGVufDF8fHx8MTc3NTA1MzEzNHww&ixlib=rb-4.1.0&q=80&w=1080', title: 'RIZQARA RESTAURANT', subtitle: 'Premium Dining Experience', description: 'The finest dining destination in Barishal — where extraordinary flavors meet unmatched elegance.', badge: '★ Best Restaurant in Barishal' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80', title: 'Authentic Taste', subtitle: "Nature's Best Ingredients", description: 'We source only the freshest, highest-quality ingredients to craft dishes that tell a story of passion.', badge: '✦ 100% Fresh & Natural' },
  { url: 'https://images.unsplash.com/photo-1552566626-52f8b828329f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80', title: 'Perfect Place for Family', subtitle: 'For Every Occasion', description: 'Create unforgettable memories with the people you love, surrounded by warm hospitality.', badge: '❤ Family Friendly' }
];

const tables = [
  { tableNumber: 'T01', seats: 4, area: 'Dining', status: 'Available' },
  { tableNumber: 'T02', seats: 4, area: 'Dining', status: 'Available' },
  { tableNumber: 'T03', seats: 6, area: 'Dining', status: 'Available' },
  { tableNumber: 'T04', seats: 4, area: 'Dining', status: 'Available' },
  { tableNumber: 'T05', seats: 2, area: 'Dining', status: 'Available' },
  { tableNumber: 'T06', seats: 4, area: 'Dining', status: 'Available' },
  { tableNumber: 'V01', seats: 8, area: 'VIP', status: 'Available' },
  { tableNumber: 'V02', seats: 6, area: 'VIP', status: 'Available' },
  { tableNumber: 'O01', seats: 4, area: 'Outdoor', status: 'Available' },
  { tableNumber: 'O02', seats: 4, area: 'Outdoor', status: 'Available' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing data to avoid duplicates on reruns
    await Promise.all(Object.values(models).map(model => model.deleteMany({})));
    console.log('Cleared existing collections.');

    console.log('Seeding Menu Items... uploading images to Cloudinary (this might take a few minutes)...');
    for (const item of menuItems) {
      if (item.image) item.image = await uploadToCloudinary(item.image);
      await models.MenuItem.create(item);
    }
    console.log('Menu items seeded.');

    console.log('Seeding Chefs...');
    for (const chef of chefs) {
      if (chef.image) chef.image = await uploadToCloudinary(chef.image);
      await models.Chef.create(chef);
    }
    console.log('Chefs seeded.');

    console.log('Seeding Reviews...');
    for (const review of reviews) {
      await models.Review.create(review);
    }
    console.log('Reviews seeded.');

    console.log('Seeding Gallery Images...');
    for (const image of galleryImages) {
      if (image.url) image.url = await uploadToCloudinary(image.url);
      await models.GalleryImage.create(image);
    }
    console.log('Gallery Images seeded.');

    console.log('Seeding Catering Packages...');
    for (const pack of cateringPackages) {
      await models.CateringPackage.create(pack);
    }
    console.log('Catering Packages seeded.');

    console.log('Seeding Carousel Slides...');
    for (const slide of carouselSlides) {
      if (slide.url) slide.url = await uploadToCloudinary(slide.url);
      await models.CarouselSlide.create(slide);
    }
    console.log('Carousel Slides seeded.');

    console.log('Seeding Tables...');
    for (const table of tables) {
      await models.RestaurantTable.create(table);
    }
    console.log('Tables seeded.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
