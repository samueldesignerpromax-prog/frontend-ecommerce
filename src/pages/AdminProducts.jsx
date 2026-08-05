import React, { useEffect, useState } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });

  const loadProducts = () => {
    api.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => loadProducts(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'image' && form.image) {
        formData.append('image', form.image);
      } else if (key !== 'image') {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editing) {
        await api.put(`/api/products/${editing}`, formData);
        toast.success('Produto atualizado!');
      } else {
        await api.post('/api/products', formData);
        toast.success('Produto criado!');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', stock: '', category: '', image: null });
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar produto');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este produto?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Produto removido!');
      loadProducts();
    } catch (err) {
      toast.error('Erro ao remover');
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      image: null,
    });
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#d4af37' }}>📦 Gerenciar Produtos</h2>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', price: '', stock: '', category: '', image: null }); }}>
          <FaPlus /> {showForm ? 'Cancelar' : 'Novo Produto'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>{editing ? 'Editar Produto' : 'Novo Produto'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label>Nome</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div><label>Preço (R$)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
              <div><label>Estoque</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required /></div>
              <div><label>Categoria</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label>Descrição</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" />
            </div>
            <div style={{ marginTop: '12px' }}>
              <label>Imagem</label>
              <input type="file" accept="image/*" onChange={e => setForm({...form, image: e.target.files[0]})} />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
              {editing ? 'Atualizar' : 'Criar'}
            </button>
          </form>
        </div>
      )}

      <div className="grid-3">
        {products.map(product => (
          <div key={product._id} className="card">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/200/1a1a1a/d4af37?text=📦'}
              alt={product.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h4 style={{ marginTop: '8px' }}>{product.name}</h4>
            <p style={{ color: '#d4af37', fontWeight: 'bold' }}>R$ {product.price.toFixed(2)}</p>
            <p style={{ color: '#888', fontSize: '0.8rem' }}>Estoque: {product.stock}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="btn-secondary" onClick={() => handleEdit(product)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                <FaEdit /> Editar
              </button>
              <button onClick={() => handleDelete(product._id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
