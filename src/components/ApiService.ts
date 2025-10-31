import { IApi, IProduct, IOrder, IOrderResult } from '../types';

export class ApiService {
    constructor(private api: IApi) { }

    getProductList(): Promise<IProduct[]> {
        return this.api.get<{ items: IProduct[] }>('/product')
            .then(response => response.items);
    }

    submitOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}