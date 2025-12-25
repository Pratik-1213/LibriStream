import React, { useState } from 'react';
import { Layout } from './src/components/Layout';
import { Dashboard } from './src/components/Dashboard';
import { BooksManager } from './src/components/BooksManager';
import { MemberManager } from './src/components/MemberManager';
import { CirculationDesk } from './src/components/CirculationDesk';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BooksManager />;
      case 'members':
        return <MemberManager />;
      case 'circulation':
        return <CirculationDesk />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;