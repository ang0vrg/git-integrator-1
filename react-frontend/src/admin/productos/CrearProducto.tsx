import React from 'react';
import { Create, SimpleForm, TextInput, NumberInput, CreateProps } from 'react-admin';
import ImageUploader from '../components/ImageUploader';

const CrearProducto: React.FC<CreateProps> = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="productName" label="Nombre" />
      <TextInput source="productDescription" label="Descripción" />
      <NumberInput source="productQuantity" label="Stock" />
      <NumberInput source="productPrice" label="Precio" />
      {/* Campo oculto para almacenar el id de la imagen en la DB */}
      <TextInput source="productImageId" style={{ display: 'none' }} />
      <TextInput source="productImageUrl" style={{ display: 'none' }} />
      <ImageUploader source="productImageId" label="Imagen del producto" />
    </SimpleForm>
  </Create>
);

export default CrearProducto;
