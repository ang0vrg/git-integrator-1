import { RaRecord } from 'react-admin';

export interface Producto extends RaRecord {
  id: number | string;
  name: string;
  price: number;
  category?: string;
  images?: string[];
  visible?: boolean;
}
