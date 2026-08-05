import React, { useEffect, useState } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/orders/my')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '24px' }}>📋 Meus Pedidos</h2>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <p><strong>Pedido:</strong> #{order._id.slice(-6)}</p>
                <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Endereço:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.number} - {order.shippingAddress?.city}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  background: order.status === 'delivered' ? '#27ae60' : order.status === 'canceled' ? '#e74c3c' : '#f39c12',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}>
                  {order.status}
                </span>
                <p style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '8px' }}>
                  R$ {order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '12px', borderTop: '1px solid #222', paddingTop: '12px' }}>
              {order.items.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>{item.product?.name || 'Produto'} x{item.quantity}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
