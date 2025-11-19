import { IProduct } from "../../types";
import { EventEmitter } from '../base/Events';

export class BasketProducts {
    items: IProduct[] = [];

    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    add(item: IProduct): void {
        this.items.push(item);
        this.events.emit("basket:changed");
    }

    remove(id: string): void {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.events.emit("basket:changed");
        }
    }

    clear(): void {
        this.items = [];
        this.events.emit("basket:changed");
    }

    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this.items.length;
    }

    contains(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}