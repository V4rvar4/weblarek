import './scss/styles.scss';

import { apiProducts } from './utils/data.ts';
import { BasketProducts } from './components/Models/BasketProducts.ts';
import { CatalogProducts } from './components/Models/CatalogProducts.ts';
import { User } from './components/Models/User.ts';
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { ApiService } from './components/ApiService.ts';


const catalogModel = new CatalogProducts();
const basketModel = new BasketProducts();
const userModel = new User();

const api = new Api(API_URL);
const apiService = new ApiService(api);


// Тест каталога
catalogModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getItems());

const getProductId = catalogModel.getProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('Товар по ID:', getProductId);

if (getProductId) {
    catalogModel.setPreviewItem(getProductId);
};

console.log('Товар, выбранный для просмотра в деталях:', catalogModel.getPreviewItem());

// Тест корзины
basketModel.addItem(apiProducts.items[1]);
console.log('Массив товары в корзине:', basketModel.getItems());
console.log('Стоимость товаров в корзине:', basketModel.getTotalPrice());
console.log('Количество товаров в корзине:', basketModel.getItemsCount());
console.log('Товар с ID в корзине:', basketModel.checkProductInCart('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
if (catalogModel.getItems().length > 0) {
    basketModel.removeItem(catalogModel.getItems()[1]);
    console.log('Корзина после удаления товара:', basketModel.getItems());
}
basketModel.clearCart();
console.log('Корзина после очистки:', basketModel.getItems());
console.log('');

// Тест формы пользователя для заказа
userModel.setData({
    payment: 'online',
    email: 'test@exaple.ru',
    phone: '+79271232323',
    address: 'Самара, ул. Васильков, д. 7',
});

console.log('Данные покупателя:', userModel.getData());
console.log('Валидация:', userModel.validate());
userModel.setData({ email: 'newemail@example.com' });
console.log('Данные после обновления email:', userModel.getData());
userModel.clearData();
console.log('Данные после очистки:', userModel.getData());
console.log('Валидация (пустые данные):', userModel.validate());
userModel.setData({
    payment: 'upon-receipt',
    phone: '+79997654321'
});
console.log('Частично заполненные данные:', userModel.getData());
console.log('Валидация (частичные данные):', userModel.validate());

// Тест api      
apiService.getProductList()
    .then((productsFromServer) => {
        console.log("Товары, полученные с сервера:", productsFromServer);
        catalogModel.setItems(productsFromServer);
        console.log("Товары в модели каталога после сохранения:", catalogModel.getItems());
    })
    .catch((error) => {
        console.error("Ошибка при получении каталога с сервера:", error);
    });

