import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { cart } = useCart();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{
      background: 'rgba(13,13,13,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #333',
      padding: '14px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 999,
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.6rem', fontWeight: 'bold', color: '#d4af37' }}>
          <FaStore /> Minha Loja
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/cart" style={{ color: '#ddd', position: 'relative' }}>
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -12,
                background: '#d4af37',
                color: '#000',
                borderRadius: '50%',
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>{cartCount}</span>
            )}
          </Link>
          {token ? (
            <>
              <span style={{ color: '#ddd' }}>Olá, {user.name || 'User'}</span>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/products" style={{ color: '#d4af37' }}>Produtos</Link>
                  <Link to="/admin/orders" style={{ color: '#d4af37' }}>Pedidos</Link>
                </>
              )}
              <Link to="/my-orders" style={{ color: '#ddd' }}>Meus Pedidos</Link>
              <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaSignOutAlt /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#ddd' }}>Login</Link>
              <Link to="/register" style={{ color: '#ddd' }}>Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
