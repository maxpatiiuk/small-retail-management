import Layout from '../components/Layout';
import { localization } from '../const/localization';

export default function MainPage(): JSX.Element {
  return (
    <Layout>
      <div
        className={`
          min-h-screen flex flex-col lg:flex-row justify-center rbg-black
          text-white
        `}
      >
        <header>
          <div
            className={`
              lg:min-h-screen gap-y-10 flex flex-col justify-between sticky
              top-0 p-10 sm:p-20
            `}
          >
            <div className="gap-y-4 flex flex-col">
              <h1 className="text-7xl">{localization.siteAuthor}</h1>
              <p className="text-3xl text-gray-400">
                {localization.siteAuthorTitle}
              </p>
            </div>
            <nav className="flex flex-col"></nav>
          </div>
        </header>
        <main className="gap-y-10 lg:pt-20 flex flex-col p-10 sm:p-20 pt-0">
          <h2 className="text-3xl">{localization.myProjects}</h2>
        </main>
      </div>
    </Layout>
  );
}
