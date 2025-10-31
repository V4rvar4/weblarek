export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TProductId = string;

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods,
    ): Promise<T>;
}

export type TPayment = 'online' | 'upon-receipt' | '';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null; 
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  total: number;
  items: TProductId[];
}

export interface IOrderResult {
  id: string;
  total: number;
}
