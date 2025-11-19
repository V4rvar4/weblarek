import { IBuyer, TPayment } from "../../types";
import { EventEmitter } from '../base/Events';

export type IBuyerValidationResult = Partial<Record<keyof IBuyer, string>>;
export type TOrderErrors = Pick<IBuyerValidationResult, "payment" | "address">;
export type TContactsErrors = Pick<IBuyerValidationResult, "email" | "phone">;

export class User {
    payment: TPayment = '';
    address: string = "";
    email: string = "";
    phone: string = "";

    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment;
            this.events.emit("order:updated");
        }
        if (data.address !== undefined) {
            this.address = data.address;
            this.events.emit("order:updated");
        }
        if (data.email !== undefined) {
            this.email = data.email;
            this.events.emit("contacts:updated");
        }
        if (data.phone !== undefined) {
            this.phone = data.phone;
            this.events.emit("contacts:updated");
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = '';
        this.address = "";
        this.email = "";
        this.phone = "";
        this.events.emit("order:updated");
        this.events.emit("contacts:updated");
    }

    validate(): IBuyerValidationResult {
        const errors: IBuyerValidationResult = {};
        if (!this.payment) errors.payment = "Не выбран вид оплаты";
        if (!this.address.trim()) errors.address = "Укажите адрес";
        if (!this.email.trim()) errors.email = "Укажите email";
        if (!this.phone.trim()) errors.phone = "Укажите телефон";
        return errors;
    }
}