import { localization } from '../const/localization';
import { Link } from '../components/Atoms/Link';
import { H1 } from '../components/Atoms';

export default function MainPage(): JSX.Element {
  return (
    <>
      <header className="flex gap-2">
        <H1>{localization.siteTitle}</H1>
        <span className="-ml-2 flex-1" />
        <Link.Info href="./employees">{localization.editEmployees}</Link.Info>
      </header>
    </>
  );
}
