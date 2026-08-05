import React, { useEffect, useState } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    api.get('/api/orders/admin')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => loadOrders(), []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/orders/admin/${id}/status`, { status });
      toast.success('Status atualizado!');
      loadOrders();
    } catch (err) {
      toast.error('Erro ao atualizar status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '24px' }}>📋 Todos os Pedidos</h2>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <p><strong>Pedido:</strong> #{order._id.slice(-6)}</p>
                <p><strong>Cliente:</strong> {order.user?.name || order.user}</p>
                <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Endereço:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.number} - {order.shippingAddress?.city}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                  style={{ padding: '6px 12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="preparing">Preparando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="canceled">Cancelado</option>
                </select>
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
