import { IProduct } from '../../types';

export class BasketProducts {
    private _items: IProduct[];

    constructor() {
        this._items = [];
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
    }

    removeItem(item: IProduct): void {
        const index = this._items.findIndex(cartItem => cartItem.id === item.id);
        if (index !== -1) {
            this._items.splice(index, 1);
        }
    }

    clearCart(): void {
        this._items = [];
    }

    getTotalPrice(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemsCount(): number {
        return this._items.length;
    }

    checkProductInCart(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}