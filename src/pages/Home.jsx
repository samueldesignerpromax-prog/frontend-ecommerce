import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaShoppingCart } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '24px' }}>🛒 Nossos Produtos</h2>
      <div className="grid-3">
        {products.map(product => (
          <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to={`/product/${product._id}`}>
              <img
                src={product.imageUrl || 'https://via.placeholder.com/200/1a1a1a/d4af37?text=📦'}
                alt={product.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Link>
            <h3 style={{ marginTop: '12px' }}>{product.name}</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{product.description?.slice(0, 60)}...</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ color: '#d4af37', fontSize: '1.4rem', fontWeight: 'bold' }}>
                R$ {product.price.toFixed(2)}
              </span>
              <button
                className="btn-primary"
                onClick={() => addToCart(product)}
                style={{ padding: '6px 14px', fontSize: '0.9rem' }}
              >
                <FaShoppingCart /> Comprar
              </button>
            </div>
            <small style={{ color: '#666', marginTop: '4px' }}>
              Estoque: {product.stock} unidades
            </small>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          Nenhum produto cadastrado ainda.
        </p>
      )}
    </div>
  );
}
