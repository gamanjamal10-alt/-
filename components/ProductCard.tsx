import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
      <Link to={`/products/${product.id}`}>
        <img className="h-56 w-full object-cover" src={product.images[0]} alt={product.name} />
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
          <p className="mt-2 text-2xl font-extrabold text-green-700">{product.price.toLocaleString()} دج</p>
          <p className="mt-2 text-gray-600 truncate">{product.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;