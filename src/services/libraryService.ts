import { Book, Member, Transaction, DashboardStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const libraryService = {
  // Books
  getBooks: async (): Promise<Book[]> => {
    const res = await fetch(`${API_URL}/books`);
    if (!res.ok) throw new Error('Failed to fetch books');
    return res.json();
  },
  
addBook: async (data: any): Promise<Book> => {
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  
  if (!res.ok) {
    // Throw the actual error message from the backend
    throw new Error(responseData.message || 'Failed to add book');
  }
  
  return responseData;
},

  // Members
  getMembers: async (): Promise<Member[]> => {
    const res = await fetch(`${API_URL}/members`);
    if (!res.ok) throw new Error('Failed to fetch members');
    return res.json();
  },
  addMember: async (data: Omit<Member, '_id' | 'joined_date'>): Promise<Member> => {
    const res = await fetch(`${API_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add member');
    return res.json();
  },

  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const res = await fetch(`${API_URL}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },
  issueBook: async (bookId: string, memberId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/transactions/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, memberId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to issue book');
    }
  },
  returnBook: async (transactionId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/transactions/return/${transactionId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to return book');
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};