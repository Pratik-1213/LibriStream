import React, { useEffect, useState } from 'react';
import { libraryService } from '../services/libraryService';
import { Book } from '../types';
import { Plus, Search } from 'lucide-react';

export const BooksManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    stock_quantity: 1,
  });

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await libraryService.getBooks();
      setBooks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBooks(); }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await libraryService.addBook(formData);
      setShowForm(false);
      setFormData({ title: '', author: '', isbn: '', category: '', stock_quantity: 1 });
      loadBooks();
    } catch (error: any) {
      // This will now show the specific error from the backend (e.g., "ISBN required")
      alert(error.message || "Failed to add book");
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Books Inventory</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Add New Book
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Add Book Details</h3>
          <form onSubmit={handleAddBook} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <input required placeholder="Title" className="form-input" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Author" className="form-input" 
              value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
            <input required placeholder="ISBN" className="form-input" 
              value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
            <input required placeholder="Category" className="form-input" 
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            
            {/* FIX: Added '|| 0' to prevent NaN when input is empty */}
            <input 
              required 
              type="number" 
              min="1" 
              placeholder="Stock" 
              className="form-input" 
              value={formData.stock_quantity} 
              onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})} 
            />
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Book</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <div className="table-header-control">
          <Search size={20} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.875rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th style={{ textAlign: 'center' }}>Avail</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{textAlign: 'center'}}>Loading...</td></tr> : 
               filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td className="text-main">{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td style={{ fontFamily: 'monospace' }}>{book.isbn}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: book.available_quantity > 0 ? '#16a34a' : '#dc2626' }}>
                      {book.available_quantity} / {book.stock_quantity}
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