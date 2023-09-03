import { dictionary } from '../lib/localization';

export const localization = dictionary({
  siteTitle: { en: 'Small Retail Management', uk: 'Таблиця' },
  // TODO: add
  siteDescription: { en: '', uk: '' },
  siteKeywords: { en: '', uk: '' },
  loading: { en: 'Loading...', uk: 'Загрузка...' },
  signIn: { en: 'Sign In', uk: 'Вхід' },
  wrongEmail: {
    en: (email: string) => `
      User with ${email} email is not authorized to use this application. Please
      contact your system administrator
    `,
    uk: (email: string) => `
      Користувач із адресою електронної пошти ${email} не має прав на використання
      цієї програми. Будь ласка зверніться до свого системного адміністратора
  `,
  },
  notFound: {
    en: 'Page not found',
    uk: 'Сторінку не знайдено',
  },
  notFoundDescription: {
    en: 'The page you are looking for might have been removed had its name changed or is temporarily unavailable.',
    uk: 'Сторінку, яку ви шукаєте, можливо, було видалено, змінено її назву або вона тимчасово недоступна.',
  },
  returnToHomePage: {
    en: 'Return to the home page',
    uk: 'Повернутися на головну сторінку',
  },
});
