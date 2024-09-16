import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  shortDescription: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  salesPrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  inStock: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  seller_Name: { type: String, required: true },
  tags: { type: String, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  isFeatured: { type: Boolean, default: false },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true } // Ensure unique index for slug
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
