import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book_id', 'title')
      .populate('member_id', 'name')
      .sort({ issue_date: -1 });

    const formatted = transactions.map(t => ({
      _id: t._id,
      book_details: t.book_id || { title: 'Unknown Book' },
      member_details: t.member_id || { name: 'Unknown Member' },
      issue_date: t.issue_date,
      status: t.status
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const issueBook = async (req, res) => {
  const { bookId, memberId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findById(bookId).session(session);
    if (!book || book.available_quantity < 1) {
      throw new Error('Book out of stock or not found');
    }

    book.available_quantity -= 1;
    await book.save({ session });

    const transaction = new Transaction({ book_id: bookId, member_id: memberId });
    await transaction.save({ session });

    await session.commitTransaction();
    res.status(201).json(transaction);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const returnBook = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await Transaction.findById(req.params.id).session(session);
    if (!transaction || transaction.status === 'Returned') {
      throw new Error('Invalid transaction or already returned');
    }

    transaction.status = 'Returned';
    transaction.return_date = new Date();
    await transaction.save({ session });

    await Book.findByIdAndUpdate(transaction.book_id, { $inc: { available_quantity: 1 } }, { session });

    await session.commitTransaction();
    res.json(transaction);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};