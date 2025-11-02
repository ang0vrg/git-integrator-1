import React, { useEffect, useState } from 'react';

type Producto = {
  idProduct: number;
  productName: string;
  productDescription?: string;
  productPrice?: number;
  productQuantity?: number;
  productImageId?: string;
};

const ProductSearch: React.FC = () => {
  const [items, setItems] = useState<Producto[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/productos?_start=0&_end=100');
        if (!res.ok) return;
        const data = await res.json();
        setItems(data || []);
      } catch (e) {
        console.error('Error cargando productos', e);
      }
    };
    load();
  }, []);

  const filtered = items.filter((p) =>
    p.productName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Buscar productos</h3>
      <input
        placeholder="Buscar por nombre..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', padding: '6px 8px', marginBottom: 8 }}
      />
      <div style={{ maxHeight: 320, overflow: 'auto' }}>
        {filtered.map((p) => (
          <div key={p.idProduct} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <img
              src={p.productImageId ? `/api/imagenes/${p.productImageId}` : '/img/tortaClasica.png'}
              alt={p.productName}
              style={{ width: 56, height: 44, objectFit: 'cover', borderRadius: 6 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.productName}</div>
              <div style={{ fontSize: 12, color: '#666' }}>S/ {p.productPrice ?? ''} · Stock: {p.productQuantity ?? 0}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: '#666' }}>No se encontraron productos</div>}
      </div>
    </div>
  );
};

export default ProductSearch;
