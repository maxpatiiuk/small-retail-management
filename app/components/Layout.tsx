import { localization } from '../const/localization';

export function title(title: string): string {
  if (title === '') return localization.siteTitle;

  return title.endsWith(' ') ? `${title}- ${localization.siteTitle}` : title;
}
