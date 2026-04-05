const mongoose = require('mongoose');

// Configure Mongoose to include virtuals when converting to JSON (so _id becomes id)
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.__v;
  }
});

const MenuItemSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  price: Number,
  image: String,
  description: String,
  ingredients: [String],
  nutrition: { calories: Number, protein: String, carbs: String, fat: String },
  spiceLevel: String,
  rating: Number,
  reviewCount: Number,
  isVeg: Boolean,
  isSpicy: Boolean,
  isPopular: Boolean,
  prepTime: String,
  serves: String,
});

const ChefSchema = new mongoose.Schema({
  name: String,
  position: String,
  experience: String,
  speciality: String,
  image: String,
  bio: String,
});

const ReviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  date: String,
  location: String,
});

const GalleryImageSchema = new mongoose.Schema({
  url: String,
  category: String,
  title: String,
});

const CateringPackageSchema = new mongoose.Schema({
  name: String,
  price: String,
  serves: String,
  features: [String],
  popular: Boolean,
  color: String,
});

const CarouselSlideSchema = new mongoose.Schema({
  url: String,
  title: String,
  subtitle: String,
  description: String,
  badge: String,
});

const RestaurantTableSchema = new mongoose.Schema({
  tableNumber: String,
  seats: Number,
  area: String,
  status: { type: String, default: 'Available' },
  currentOrderId: String,
  occupiedSince: Number,
});

const TableOrderSchema = new mongoose.Schema({
  tableId: String,
  tableNumber: String,
  items: [{
    itemId: String,
    name: String,
    price: Number,
    quantity: Number,
    note: String,
    image: String,
  }],
  total: Number,
  status: { type: String, default: 'Pending' },
  createdAt: Number,
  customerNote: String,
});

const OrderSchema = new mongoose.Schema({
  items: [{
    item: { type: mongoose.Schema.Types.Mixed },
    quantity: Number,
    specialRequest: String,
  }],
  total: Number,
  status: { type: String, default: 'Pending' },
  paymentMethod: String,
  customerName: String,
  phone: String,
  address: String,
  createdAt: String,
  estimatedTime: String,
  orderNumber: String,
});

const ReservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  date: String,
  time: String,
  guests: Number,
  specialRequest: String,
  status: { type: String, default: 'Pending' },
  createdAt: String,
});

const MessageSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  subject: String,
  message: String,
  createdAt: String,
  isRead: { type: Boolean, default: false },
  reply: String,
});

const CateringRequestSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  eventType: String,
  guests: Number,
  date: String,
  location: String,
  package: String,
  message: String,
  status: { type: String, default: 'Pending' },
  createdAt: String,
});

module.exports = {
  MenuItem: mongoose.model('MenuItem', MenuItemSchema),
  Chef: mongoose.model('Chef', ChefSchema),
  Review: mongoose.model('Review', ReviewSchema),
  GalleryImage: mongoose.model('GalleryImage', GalleryImageSchema),
  CateringPackage: mongoose.model('CateringPackage', CateringPackageSchema),
  CarouselSlide: mongoose.model('CarouselSlide', CarouselSlideSchema),
  RestaurantTable: mongoose.model('RestaurantTable', RestaurantTableSchema),
  TableOrder: mongoose.model('TableOrder', TableOrderSchema),
  Order: mongoose.model('Order', OrderSchema),
  Reservation: mongoose.model('Reservation', ReservationSchema),
  Message: mongoose.model('Message', MessageSchema),
  CateringRequest: mongoose.model('CateringRequest', CateringRequestSchema),
};
