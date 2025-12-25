import React, { useEffect, useState } from 'react';
import { libraryService } from '../services/libraryService';
import { Book, Member, Transaction, TransactionStatus } from '../types';
import { ArrowRightLeft, CheckCircle, AlertCircle } from 'lucide-react';

export const CirculationDesk: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [b, m, t] = await Promise.all([
        libraryService.getBooks(),
        libraryService.getMembers(),
        libraryService.getTransactions()
      ]);
      setBooks(b);
      setMembers(m);
      setTransactions(t);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await libraryService.issueBook(selectedBook, selectedMember);
      setSelectedBook('');
      setSelectedMember('');
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to issue");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (id: string) => {
    try {
      await libraryService.returnBook(id);
      await loadData();
    } catch (err) {
      alert("Failed to return book");
    }
  };

  const activeLoans = transactions.filter(t => t.status === TransactionStatus.Issued);

  return (
    <div className="animate-fade-in split-view">
      {/* Issue Form */}
      <div className="card split-left" style={{ height: 'fit-content' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowRightLeft size={20} color="#4f46e5" /> Issue Book
        </h2>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleIssueBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Member</label>
            <select required className="form-select" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
              <option value="">Select Member</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Book</label>
            <select required className="form-select" value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
              <option value="">Select Book</option>
              {books.map(b => (
                <option key={b._id} value={b._id} disabled={b.available_quantity === 0}>
                  {b.title} {b.available_quantity === 0 ? '(Out of Stock)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            {loading ? 'Processing...' : 'Issue Book'}
          </button>
        </form>
      </div>

      {/* Active Loans Table */}
      <div className="table-container split-right">
        <div className="table-header-control" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Active Loans</h2>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {activeLoans.length} Active
          </span>
        </div>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeLoans.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No active loans</td></tr>
              ) : activeLoans.map((t) => (
                <tr key={t._id}>
                  <td className="text-main">{t.book_details?.title || 'Unknown'}</td>
                  <td>{t.member_details?.name || 'Unknown'}</td>
                  <td style={{ fontSize: '0.75rem' }}>{new Date(t.issue_date).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleReturnBook(t._id)} className="btn btn-danger-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                      <CheckCircle size={12} /> Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};