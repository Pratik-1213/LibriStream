import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  issue_date: { type: Date, default: Date.now },
  return_date: Date,
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' }
});

export default mongoose.model('Transaction', TransactionSchema);