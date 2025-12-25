import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  joined_date: { type: Date, default: Date.now }
});

export default mongoose.model('Member', MemberSchema);