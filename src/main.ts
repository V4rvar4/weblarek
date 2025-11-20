import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ApiService } from './components/ApiService';


import { CatalogProducts } from './components/Models/CatalogProducts';
import { BasketProducts } from './components/Models/BasketProducts';
import { User } from './components/Models/User';


import { GalleryView } from './components/View/Gallery';
import { CardCatalogView } from './components/View/Cards/CardCatalog';
import { CardPreviewView } from './components/View/Cards/CardPreview';
import { CardBasketView } from './components/View/Cards/CardBasket';
import { BasketView } from './components/View/Basket';
import { HeaderView } from './components/View/Header';
import { ModalView } from './components/View/Modal';
import { OrderFormView } from './components/View/Forms/OrderForm';
import { ContactsFormView } from './components/View/Forms/ContactsForm';
import { OrderSuccessView } from './components/View/Forms/OrderSuccess';

import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct, IBuyer, IOrder, IOrderResult } from './types';


export const events = new EventEmitter();


const catalog = new CatalogProducts(events);
const basket = new BasketProducts(events);
const user = new User(events);


const apiService = new ApiService(new Api(API_URL));


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");


const modalView = new ModalView(ensureElement<HTMLElement>("#modal-container"), {
    onClose: () => events.emit("modal:close"),
});

const basketView = new BasketView(cloneTemplate(basketTemplate), {
    onCheckout: () => events.emit("basket:checkout"),
});

const headerView = new HeaderView(ensureElement<HTMLElement>(".header"), {
    onBasketClick: () => events.emit("basket:open"),
});

const galleryView = new GalleryView(ensureElement<HTMLElement>(".gallery"), events);

const orderFormView = new OrderFormView(cloneTemplate(orderTemplate), events);

const contactsFormView = new ContactsFormView(cloneTemplate(contactsTemplate), events);


apiService
    .getProductList()
    .then((products) => {
        catalog.setItems(products);
    })
    .catch((err) => console.error("Ошибка при получении товаров", err));


events.on("catalog:changed", () => {
    const itemCards = catalog.items.map((item) => {
        const card = new CardCatalogView(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit("card:select", item),
        });
        return card.render(item);
    });

    galleryView.render({ catalog: itemCards });
});

events.on("catalog:preview", (item: IProduct) => {
    const inBasket = basket.contains(item.id);
    let buttonText = "";
    if (item.price === null) {
        buttonText = "Недоступно";
    }
    else {
        buttonText = inBasket ? "Удалить из корзины" : "В корзину";
    }
    
    const cardPreviewView = new CardPreviewView(cloneTemplate(cardPreviewTemplate), {
        onToggle: () => {
            events.emit("card:buy", item);
            modalView.close();
        },
    });

    modalView.content = cardPreviewView.render({
        item: item,
        buttonText: buttonText,
    });
    modalView.open();
});

events.on("basket:changed", () => {
    headerView.render({ counter: basket.getCount() });

    if (basket.getCount() === 0) {
        return basketView.render({
            items: [],
            total: basket.getTotal(),
        });
    }

    const items = basket.items.map((product, index) => {
        const itemView = new CardBasketView(cloneTemplate(basketItemTemplate), {
            onRemove: () => events.emit("basket:remove", product),
        });
        return itemView.render({
            title: product.title,
            price: product.price ?? null,
            index: index + 1,
        });
    });

    return basketView.render({
        items,
        total: basket.getTotal(),
    });
});

events.on("order:updated", () => {
    const errors = user.validate();

    orderFormView.render({
        payment: user.payment,
        errors: {
            payment: errors.payment,
            address: errors.address 
        },
    });
});

events.on("contacts:updated", () => {
    const errors = user.validate();

   contactsFormView.render({
        errors: {
            email: errors.email,
            phone: errors.phone
        },
    });
    
});

events.on("card:select", (item: IProduct) => catalog.setPreview(item));
events.on("card:buy", (item: IProduct) => {
    const isInBasket = basket.contains(item.id);

    if (isInBasket) {
        basket.remove(item.id);
    } else {
        basket.add(item);
    }
});

events.on("basket:remove", (item: IProduct) => {
    basket.remove(item.id);
});

events.on("basket:open", () => {
    modalView.content = basketView.render();
    modalView.open();
});

events.on("basket:checkout", () => {
    const errors = user.validate();

    modalView.content = orderFormView.render({
        payment: user.payment,
        address: user.address,
        errors: {
            payment: errors.payment,
            address: errors.address 
        },
    });

    modalView.open();
});

events.on("order:submit", () => {
    const errors = user.validate();

    modalView.content = contactsFormView.render({
        email: user.email,
        phone: user.phone,
        errors: {
            email: errors.email,
            phone: errors.phone}
    });

    modalView.open();
});

events.on("contacts:submit", () => {
    const order: IOrder = {
        payment: user.payment!,
        address: user.address,
        email: user.email,
        phone: user.phone,
        total: basket.getTotal(),
        items: basket.items.map((item) => item.id),
    };

    apiService
        .submitOrder(order)
        .then((response: IOrderResult) => {
            const success = new OrderSuccessView(cloneTemplate(successTemplate), {
                onClose: () => modalView.close(),
            });

            modalView.content = success.render({ total: response.total });

            basket.clear();
            user.clear();
        })
        .catch(() => {
            console.error("Не удалось оформить заказ, попробуйте позже");
        });
});

events.on("order:update", (data: IBuyer) => {
    user.setData(data);
});

events.on("contacts:update", (data: IBuyer) => {
    user.setData(data);
});

events.on("modal:close", () => modalView.close());