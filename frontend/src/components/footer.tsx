import React from 'react';
import { FaHome, FaUser, FaCashRegister, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-cyan-600 text-white p-3 shadow-md">
      <nav className="flex justify-around text-sm">
        <Link to="/dashboard" className="flex flex-col items-center hover:text-gray-200">
          <FaHome className="text-2xl" />
          Accueil
        </Link>
        <Link to="/cash-register" className="flex flex-col items-center hover:text-gray-200">
          <FaCashRegister className="text-2xl" />
          Caisse
        </Link>
        <Link to="/transactions" className="flex flex-col items-center hover:text-gray-200">
          <FaCog className="text-2xl" />
          Transactions
        </Link>
        <Link to="/users" className="flex flex-col items-center hover:text-gray-200">
          <FaUser className="text-2xl" />
          Administration
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;