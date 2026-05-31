import { useEffect, useState } from 'react';
import { productsApi } from '@/api/products';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';
const emptyForm = {
  name: '',
  description: '',
  brand: '',
  category: '',
  specifications: '',
};

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setProducts(await productsApi.list());
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p) {
    setEditingId(p.productId);
    setForm({
      name: p.name,
      description: p.description,
      brand: p.brand,
      category: p.category,
      specifications: p.specifications,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await productsApi.update(editingId, form);
      } else {
        await productsApi.create(form);
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(productId) {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(productId);
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Delete failed');
    }
  }

  return (
    <div>
      <h1 className="page-title">Manage products</h1>
      {error && <div className="error-banner">{error}</div>}

      <Card title={editingId ? 'Edit product' : 'Add product'}>
        <form className="form-stack" style={{ maxWidth: '100%' }} onSubmit={handleSubmit}>
          <div className="grid-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <Input label="Specifications" value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} />
          </div>
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="form-actions">
            <Button type="submit" loading={saving}>
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <h2 className="mt-2">All products</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          keyField="productId"
          data={products}
          columns={[
            { key: 'name', header: 'Name', render: (r) => r.name },
            { key: 'brand', header: 'Brand', render: (r) => r.brand },
            { key: 'category', header: 'Category', render: (r) => r.category },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="form-actions">
                  <Button variant="secondary" onClick={() => startEdit(r)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(r.productId)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
