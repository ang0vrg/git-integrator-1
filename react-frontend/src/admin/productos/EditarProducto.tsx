import React from 'react';
import { Edit, SimpleForm, TextInput, NumberInput, EditProps } from 'react-admin';
import ImageUploader from '../components/ImageUploader';

const EditarProducto: React.FC<EditProps> = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="productName" label="Nombre" />
      <TextInput source="productDescription" label="Descripción" />
      <NumberInput source="productQuantity" label="Stock" />
      <NumberInput source="productPrice" label="Precio" />
      <TextInput source="productImageId" style={{ display: 'none' }} />
      <TextInput source="productImageUrl" style={{ display: 'none' }} />
      <ImageUploader source="productImageId" label="Imagen del producto" />
    </SimpleForm>
  </Edit>
);

export default EditarProducto;
