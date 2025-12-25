import React, { useState } from 'react';
import { LayoutDashboard, Book, Users, Repeat, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Books Manager', icon: Book },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'circulation', label: 'Circulation Desk', icon: Repeat },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <h1 className="brand">
          <Book size={20} /> LibriStream
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="brand">
            <Book size={24} /> LibriStream
          </h1>
        </div>
        
        <nav className="nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          v1.0.0 Production Build
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};