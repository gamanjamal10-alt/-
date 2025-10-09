import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
      <Link to={`/stores/${store.id}`} className="block p-4 text-center">
        <img 
          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-amber-100" 
          src={store.logo} 
          alt={`${store.name} logo`} 
        />
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-800 truncate">{store.name}</h3>
          <p className="mt-1 text-sm font-semibold text-green-800">{store.type}</p>
        </div>
      </Link>
    </div>
  );
};

export default StoreCard;
