import NextLink from 'next/link';
import { className } from './className';

const linkWrapper = (name: string, className: string) =>
  ({
    [name](props: Parameters<typeof NextLink>[0]): JSX.Element {
      return (
        <NextLink
          {...props}
          className={`${className} ${props.className ?? ''}`}
        />
      );
    },
  }[name]);

export const Link = {
  Default: linkWrapper('Link.Default', `${className.link}`),
  Success: linkWrapper(
    'Link.Success',
    `${className.button} ${className.success}`
  ),
  Danger: linkWrapper('Link.Danger', `${className.button} ${className.danger}`),
  Info: linkWrapper('Link.Info', `${className.button} ${className.info}`),
};
