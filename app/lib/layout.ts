import { localization } from '../const/localization';

export const title = (title: string = ''): string =>
  title === ''
    ? localization.siteTitle
    : `${title} - ${localization.siteTitle}`;
