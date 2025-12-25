export enum TransactionStatus {
  Issued = 'Issued',
  Returned = 'Returned',
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  stock_quantity: number;
  available_quantity: number;
}

export interface Member {
  _id: string;
  name: string;
  email: string;
  joined_date: string; // ISO Date string
}

export interface Transaction {
  _id: string;
  book_id: string;
  member_id: string;
  issue_date: string; // ISO Date string
  return_date: string | null; // ISO Date string or null
  status: TransactionStatus;
  
  // Populated fields for UI convenience (simulating Mongoose .populate())
  book_details?: Book;
  member_details?: Member;
}

export interface DashboardStats {
  totalBooks: number;
  activeMembers: number;
  activeLoans: number;
}