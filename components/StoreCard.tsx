import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
      <Link to={`/stores/${store.id}`} className="block p-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <img className="h-20 w-20 rounded-full object-cover" src={store.logo} alt={store.name} />
          <div>
            <h3 className="text-xl font-bold text-gray-800">{store.name}</h3>
            <span className="text-sm bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full">{store.type}</span>
          </div>
        </div>
        <p className="mt-4 text-gray-600 truncate">{store.description}</p>
      </Link>
    </div>
  );
};

export default StoreCard;
