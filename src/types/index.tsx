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
  joined_date: string;
}

export enum TransactionStatus {
  Issued = 'Issued',
  Returned = 'Returned'
}

export interface Transaction {
  _id: string;
  book_details: { title: string };
  member_details: { name: string };
  issue_date: string;
  status: TransactionStatus;
}

export interface DashboardStats {
  totalBooks: number;
  activeMembers: number;
  activeLoans: number;
}