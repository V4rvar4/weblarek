import { IProduct } from "../../types";
import { EventEmitter } from '../base/Events';

export class CatalogProducts {
    items: IProduct[] = [];
    previewItem: IProduct | null = null;

    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit("catalog:changed");
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.previewItem = item;
        this.events.emit("catalog:preview", item);
    }

    clearPreview(): void {
        this.previewItem = null;
        this.events.emit("catalog:previewClosed");
    }
}