import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  category: { type: String, required: true },
  stock_quantity: { type: Number, required: true, min: 0 },
  // Ensure 'required' is removed here so validation passes
  available_quantity: { type: Number, min: 0 },
  added_date: { type: Date, default: Date.now }
});

// --- FIXED MIDDLEWARE ---
// We removed 'next' from the function arguments and the next() call.
// This forces Mongoose to run this synchronously, which prevents the crash.
BookSchema.pre('validate', function() {
  if (this.isNew && (this.available_quantity === undefined || this.available_quantity === null)) {
    this.available_quantity = this.stock_quantity;
  }
});

export default mongoose.model('Book', BookSchema);