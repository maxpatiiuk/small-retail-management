import { localization } from './const/localization';
import { Metadata } from 'next';
import { title } from './lib/layout';
import { Link } from './Atoms/Link';

export default function MainPage(): JSX.Element {
  return (
    <Link.Default href="./employees">{localization.editEmployees}</Link.Default>
  );
}

export const generateMetadata = (): Metadata => ({
  title: title(),
});
