import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaShoppingCart } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/');
      });
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400/1a1a1a/d4af37?text=📦'}
          alt={product.name}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px' }}
        />
      </div>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h2>{product.name}</h2>
        <p style={{ color: '#aaa', marginTop: '8px' }}>{product.description}</p>
        <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '8px' }}>Categoria: {product.category}</p>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Estoque: {product.stock} unidades</p>
        <div style={{ marginTop: '20px' }}>
          <span style={{ color: '#d4af37', fontSize: '2rem', fontWeight: 'bold' }}>
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={() => addToCart(product)}
          style={{ marginTop: '20px', fontSize: '1.1rem', padding: '12px 32px' }}
        >
          <FaShoppingCart /> Adicionar ao Carrinho
        </button>
        <br />
        <button
          className="btn-secondary"
          onClick={() => navigate('/')}
          style={{ marginTop: '12px' }}
        >
          Voltar ao Catálogo
        </button>
      </div>
    </div>
  );
}
