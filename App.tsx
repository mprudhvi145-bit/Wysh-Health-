import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Investor } from './pages/Investor';
import { Contact } from './pages/Contact';
import { Team } from './pages/Team';
import { AIHealthDash } from './pages/AIHealthDash';

// Placeholder for Products page
const Products = () => (
  <div className="min-h-screen flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Product Suite</h1>
      <p className="text-text-secondary">Modules loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investors" element={<Investor />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/products" element={<Products />} />
          <Route path="/ai-health" element={<AIHealthDash />} />
          <Route path="/ecosystem" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;