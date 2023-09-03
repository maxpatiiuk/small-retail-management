# one-c-table

```
TODO: add documentation and screenshots
TODO: update site.webmanifest
TODO: add
github repo description
TODO: firebase -> settings -> environemnt type ->
production

TODO: update the following url: Source code for
[https://one-c-table.vercel.app/](https://one-c-table.vercel.app/).
TODO: play with firebase indexing - https://console.firebase.google.com/u/0/project/one-c-table/firestore/indexes
TODO: decide between vercel and firebase hosting
Tabs:
https://github.com/firebase/quickstart-js
https://one-c-table.vercel.app/
http://mambo.zzz.com.ua/project/one_c/
```

## Development

```zsh
npm i       # install dependencies
npm run dev # start development server
```

This would start the development server at
[http://locahlost:3000](http://locahlost:3000).

## Production

```zsh
npm i         # install dependencies
npm run build # begin the build process
npm run start # start production server
```

This would start the production server at
[http://locahlost:3000](http://locahlost:3000).

Afterward, you can deploy this site at [https://vercel.com](https://vercel.com).

Alternatively, you can configure a reverse proxy (e.x Nginx) that would handle
the SSL certificate and forward the requests to port 80, which should be made
externally available.
