import React from 'react';
import { FieldProps } from 'react-admin';

const ImagePreviewField: React.FC<FieldProps> = ({ record, source, label }) => {
  if (!record) return null;
  const id = (record as any)[source as string];
  const url = (record as any)['productImageUrl'] ?? (record as any)['imageUrl'] ?? (id ? `/api/imagenes/${id}` : null);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={(label as string) || 'Imagen'}
      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
    />
  );
};

export default ImagePreviewField;
