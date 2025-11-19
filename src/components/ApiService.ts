import { IApi, IProduct, IOrder, IOrderResult } from '../types';
import { CDN_URL } from '../utils/constants';

export class ApiService {
    constructor(private api: IApi) { }

    getProductList(): Promise<IProduct[]> {
        return this.api.get<{ items: IProduct[] }>('/product')
            .then(response => response.items.map(item => ({
                ...item,
                image: CDN_URL + item.image.replace(/\.svg$/i, '.png'),
            })));
    }

    submitOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}