import { Stock } from "./stock";

export interface Product {
    id: number;
    user_id: number;
    name: string;
    image: Blob | null;
    description: string;
    value: number;
    created_at: string | Date;
    updated_at: string | Date; 
    stock?: Stock;
  }
  