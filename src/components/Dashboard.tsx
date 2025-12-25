import React, { useEffect, useState } from 'react';
import { libraryService } from '../services/libraryService';
import { DashboardStats } from '../types';
import { BookOpen, Users, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await libraryService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{padding: '2rem', color: '#6b7280'}}>Loading dashboard...</div>;
  if (!stats) return <div style={{padding: '2rem', color: 'red'}}>Failed to load data.</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>System Overview</h2>
      
      <div className="grid-cols-3">
        {/* Total Books */}
        <div className="card stat-card">
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Total Books</p>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{stats.totalBooks}</h3>
          </div>
          <div className="stat-icon blue">
            <BookOpen size={24} />
          </div>
        </div>

        {/* Active Members */}
        <div className="card stat-card">
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Active Members</p>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{stats.activeMembers}</h3>
          </div>
          <div className="stat-icon green">
            <Users size={24} />
          </div>
        </div>

        {/* Active Loans */}
        <div className="card stat-card">
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Active Loans</p>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{stats.activeLoans}</h3>
          </div>
          <div className="stat-icon amber">
            <Activity size={24} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', background: '#312e81', borderRadius: '0.75rem', padding: '2rem', color: 'white' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome to LibriStream</h3>
        <p style={{ color: '#e0e7ff', lineHeight: 1.5 }}>
          Manage your library inventory, track member activity, and handle book circulation efficiently. 
        </p>
      </div>
    </div>
  );
};