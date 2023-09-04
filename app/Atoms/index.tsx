import { wrap } from './wrap';

export const Form = wrap(
  'Form',
  'form',
  'flex flex-col gap-2',
  ({ onSubmit: handleSubmit, ...props }) => ({
    ...props,
    onSubmit:
      typeof handleSubmit === 'function'
        ? (event) => {
            event.preventDefault();
            handleSubmit(event);
          }
        : undefined,
  })
);

export const Centered = wrap(
  'Centered',
  'div',
  'flex items-center justify-center w-screen h-screen text-center'
);
