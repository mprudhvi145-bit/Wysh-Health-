
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Activity, User, LogOut, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';
import { NeuralGrid } from './3DVisuals';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-surgical/90 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal to-purple rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-teal/50 transition-shadow">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-white">
            WYSH<span className="text-teal font-light">CARE</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-teal' : 'text-text-secondary hover:text-white'}`}
            >
              {item.label}
            </NavLink>
          ))}
          
          {isAuthenticated ? (
             <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="flex items-center gap-3 group cursor-pointer relative">
                    <div className="text-right hidden lg:block">
                        <p className="text-white text-sm font-bold leading-none">{user?.name}</p>
                        <p className="text-text-secondary text-xs uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-teal/20 border border-teal text-teal flex items-center justify-center">
                        {user?.avatar ? (
                             <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                        ) : (
                             <span className="font-bold">{user?.name.charAt(0)}</span>
                        )}
                    </div>
                    
                    {/* Simple Logout Dropdown for Demo */}
                    <button 
                        onClick={handleLogout}
                        className="absolute top-10 right-0 w-32 bg-surgical border border-white/10 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto"
                    >
                        <div className="flex items-center gap-2 text-red-400 text-sm hover:bg-white/5 p-2 rounded">
                            <LogOut size={14} /> Logout
                        </div>
                    </button>
                </div>
             </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <NavLink to="/login" className="text-text-secondary hover:text-white text-sm font-medium">Log In</NavLink>
                <NavLink to="/signup">
                    <Button variant="primary" className="!py-2 !px-4 !text-sm">Get Started</Button>
                </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-surgical border-b border-white/10 p-6 flex flex-col gap-4 animate-slideDown shadow-2xl">
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="text-lg text-text-secondary py-2 border-b border-white/5"
            >
              {item.label}
            </NavLink>
          ))}
          
          <div className="pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal flex items-center justify-center text-teal">
                             {user?.name.charAt(0)}
                        </div>
                        <div>
                             <p className="text-white font-bold">{user?.name}</p>
                             <p className="text-xs text-text-secondary uppercase">{user?.role}</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout} icon={<LogOut size={16}/>} className="justify-center">
                        Logout
                    </Button>
                  </>
              ) : (
                  <>
                    <NavLink to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-center">Log In</Button>
                    </NavLink>
                    <NavLink to="/signup" onClick={() => setIsOpen(false)}>
                        <Button variant="primary" className="w-full justify-center">Get Started</Button>
                    </NavLink>
                  </>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <NeuralGrid />
      <Navbar />
      <main className="flex-grow pt-20 relative z-10">
        {children}
      </main>
      <footer className="bg-surgical-light border-t border-white/5 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-4">WYSH<span className="text-teal">CARE</span></h3>
            <p className="text-text-secondary text-sm">
              The operating system for modern healthcare. 
              Unified, intelligent, and secure.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>Telemedicine</li>
              <li>EHR System</li>
              <li>Medical Coding AI</li>
              <li>Logistics</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Investors</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4">Legal</h4>
             <p className="text-xs text-text-secondary">© 2024 Wysh Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
