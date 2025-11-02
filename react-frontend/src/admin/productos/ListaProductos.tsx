import React from 'react';
import { List, Datagrid, TextField, NumberField, EditButton, ListProps } from 'react-admin';
import ImagePreviewField from '../components/ImagePreviewField';

// Lista de productos simple sin buscador (revertida a la versión estable)
const ListaProductos: React.FC<ListProps> = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="idProduct" />
        <ImagePreviewField source="productImageId" label="Imagen" />
        <TextField source="productName" label="Nombre" />
        <TextField source="productDescription" label="Descripción" />
        <NumberField source="productQuantity" label="Stock" />
        <NumberField source="productPrice" label="Precio" />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default ListaProductos;
