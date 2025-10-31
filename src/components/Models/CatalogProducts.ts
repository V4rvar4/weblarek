import { IProduct } from '../../types';

export class CatalogProducts {
    private _items: IProduct[];
    private _previewItem: IProduct | null;

    constructor() {
        this._items = [];
        this._previewItem = null;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getProduct(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setPreviewItem(item: IProduct): void {
        this._previewItem = item;
    }

    getPreviewItem(): IProduct | null {
        return this._previewItem;
    }
}