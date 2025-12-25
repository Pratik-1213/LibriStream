import React, { useEffect, useState } from 'react';
import { libraryService } from '../services/libraryService';
import { Member } from '../types';
import { Plus, Mail } from 'lucide-react';

export const MemberManager: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await libraryService.getMembers();
      setMembers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await libraryService.addMember(formData);
      setShowForm(false);
      setFormData({ name: '', email: '' });
      loadMembers();
    } catch (error) {
      alert("Failed to add member");
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex justify-between items-center">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Members</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Register Member
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input required placeholder="Full Name" className="form-input" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email" className="form-input" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Confirm</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-cols-3">
        {loading ? <p>Loading...</p> : members.map((member) => (
          <div key={member._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold' }}>
              {member.name.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ fontWeight: 600, margin: 0 }}>{member.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                <Mail size={12} /> {member.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};