import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Transaction from '../models/Transaction.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const activeMembers = await Member.countDocuments();
    const activeLoans = await Transaction.countDocuments({ status: 'Issued' });
    
    res.json({ totalBooks, activeMembers, activeLoans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};