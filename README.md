# Контрольна робота. Варіант №3: Веб застосунок керування власним бюджетом

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Запуск застосунку локально

Створити файл `.env` зі змінною `REACT_APP_BASE_URL="BACK_END_URL"`.

На машині повинен бути вставновлений Node.js версії `16.15.0`. Можна використати бібліотеку `nvm` для забезпечення цієї умови.

```
npm install 
npm start
```
## Stack

Для створення front-end застосунку використовувались такі інструменти
1. React.js для створення юзер інтерфейсу та керування стейтом компонетів.
2. `react-router-dom` для створення внутрішнього раутингу додатка.
3. TypeScript для забезпечення строгої типизації.
4. Redux + redux-persist для керування глобальним стейтом додатку.
5. react-apexcharts для відображення графіків та діаграм.
6. Material UI - UI toolkit (аналог Bootstrap для Реакт додатків)ю

## Деплоймент
Сайт задеплоїний за допомогою Netlify.com

## Опис функціоналу

1. Юзер має змогу зареєструватись і увійти у свій профіль (авторизація).
2. Юзер може оновити пароль на сторінці профілю.
3. Юзер має змогу створити декілька рахунків 2 видів - у національній валюті (гривня, доллар, євро) та криптовалюті (Біткоїн, Етер). Рахунок може бути кредитним або дебетним.
4. Юзер ає змогу редагувати рахунок (змінити назву, іконку, тип рахунку у випадку, якщо баланс рахунку позитивний).
5. Юзер має змогу переглядати створеня рахунки та інформацію про них.
6. Юзер має змогу створювати транзакції та перекази між рахунками, а також редагувати створені транзакції.
7. Юзер має змогу видаляти рахунки.
8. Юзер має змогу видаляти транзакції.
9. Юзер має змогу створити категорії, отримувачів платежів та теґи на сторінці Налаштування і використовувати їх при створенні та редагуванні транзакцій.
10. Юзер має змогу дивитись статистику за поточний місяць на головній сторінці (Dashboard) - загільні витрати у гривні, загальні доходи у гривні, кількість транзакцій, загальний баланс (сума балансів з усіх рахунків у долларовому еквіваленті), графік зміни загального балансу за місяць, діаграма витрат за категоріями, а також список останніх транзікцій.
11. Юзер може вийти з аккаунту.
