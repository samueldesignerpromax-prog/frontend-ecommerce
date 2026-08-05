import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await api.post('/api/orders', {
        items,
        shippingAddress: address,
      });

      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '24px' }}>📦 Finalizar Compra</h2>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSubmit} style={{ flex: 2, minWidth: '300px' }}>
          <h3>Endereço de Entrega</h3>
          <div style={{ marginBottom: '12px' }}>
            <label>Rua</label>
            <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Número</label>
            <input type="text" value={address.number} onChange={e => setAddress({...address, number: e.target.value})} required />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Cidade</label>
            <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Estado</label>
            <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label>CEP</label>
            <input type="text" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Processando...' : 'Confirmar Pedido'}
          </button>
        </form>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Resumo do Pedido</h3>
          {cart.map(item => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #222' }}>
              <span>{item.name} x{item.quantity}</span>
              <span style={{ color: '#d4af37' }}>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: '16px', fontSize: '1.4rem', fontWeight: 'bold', color: '#d4af37' }}>
            Total: R$ {totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
