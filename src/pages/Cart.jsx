import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>🛒 Seu carrinho está vazio</h2>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
          Voltar às compras
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '24px' }}>🛒 Meu Carrinho</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cart.map(item => (
          <div key={item.productId} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={item.imageUrl || 'https://via.placeholder.com/80/1a1a1a/d4af37?text=📦'}
              alt={item.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <h4>{item.name}</h4>
              <p style={{ color: '#d4af37', fontWeight: 'bold' }}>R$ {item.price.toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ background: '#333', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                <FaMinus />
              </button>
              <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ background: '#333', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                <FaPlus />
              </button>
            </div>
            <button onClick={() => removeFromCart(item.productId)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '1px solid #333', paddingTop: '20px' }}>
        <p style={{ fontSize: '1.2rem' }}>
          Total: <strong style={{ color: '#d4af37', fontSize: '1.6rem' }}>R$ {totalPrice.toFixed(2)}</strong>
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button className="btn-secondary" onClick={clearCart}>Limpar Carrinho</button>
          <button className="btn-primary" onClick={() => navigate('/checkout')}>Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
}
