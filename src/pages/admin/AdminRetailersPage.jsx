import { useEffect, useState } from 'react';
import { retailersApi } from '@/api/retailers';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';
const emptyForm = { name: '', websiteUrl: '' };

export function AdminRetailersPage() {
  const [retailers, setRetailers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setRetailers(await retailersApi.list());
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await retailersApi.update(editingId, form);
      } else {
        await retailersApi.create(form);
      }
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(retailerId) {
    if (!confirm('Delete retailer? Associated scraper may be affected.')) return;
    try {
      await retailersApi.delete(retailerId);
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Delete failed');
    }
  }

  return (
    <div>
      <h1 className="page-title">Manage retailers</h1>
      <p className="page-subtitle">One scraper per retailer.</p>
      {error && <div className="error-banner">{error}</div>}

      <Card title={editingId ? 'Edit retailer' : 'Add retailer'}>
        <form className="form-stack" onSubmit={handleSubmit}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Website URL" type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} required />
          <div className="form-actions">
            <Button type="submit" loading={saving}>
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <h2 className="mt-2">All retailers</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          keyField="retailerId"
          data={retailers}
          columns={[
            { key: 'name', header: 'Name', render: (r) => r.name },
            {
              key: 'url',
              header: 'Website',
              render: (r) => (
                <a href={r.websiteUrl} target="_blank" rel="noreferrer">
                  {r.websiteUrl}
                </a>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="form-actions">
                  <Button variant="secondary" onClick={() => { setEditingId(r.retailerId); setForm({ name: r.name, websiteUrl: r.websiteUrl }); }}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(r.retailerId)}>
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
