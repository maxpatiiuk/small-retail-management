# Small Retail Management

A simple-to-use dashboard for tracking revenue, expenses, and salaries for every
employee of your small business. Gain insights, see trends and make informed
decisions.

[Project description and screenshots](https://max.patii.uk/projects/small-retail-management)

[Video demo](https://www.youtube.com/watch?v=NjbcGXO9c3g)

## Features

- Conveniently enter data for the day or entire week from your phone or desktop
- See total revenue, expenses and salary for each employee for the month, year
  or all time
- Easily jump between dates to see historical data
- Add employees, set revenue share percentage and base salary - total salary
  will be calculated automatically

## Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/maxxxxxdlp/small-retail-management
   ```

2. Install dependencies:

   ```sh
   npm i
   ```

3. [Create a Firebase project and a Firestore database](https://firebase.google.com/docs/firestore/quickstart?hl=en&authuser=0).

4. Use security rules in [./firestore.rules](./firestore.rules) for the
   Firestore database. Modify the `isAuthenticated` function to match your
   security needs - for example allow only users with certain email addresses to
   access your application.

5. [Generate your Firebase config object](https://firebase.google.com/docs/web/learn-more?authuser=0#config-object).

6. Copy [./example.env.local](./example.env.local) into `.env.local` and fill it
   in with values generated in the previous step.

7. [Enable Firebase authentication and enable Google authentication provider](https://firebase.google.com/docs/auth/web/google-signin?authuser=0&hl=en#before_you_begin).

8. [Enable daily and weekly backups of the database](https://firebase.google.com/docs/firestore/backups)

## Development

```zsh
npm run dev # start development server
```

This would start the development server at
[http://locahlost:3000](http://locahlost:3000).

## Production

```zsh
npm run build # begin the build process
npm run start # start production server
```

This would start the production server at
[http://locahlost:3000](http://locahlost:3000).

Afterward, you can deploy this site at [https://vercel.com](https://vercel.com).

Alternatively, you can configure a reverse proxy (e.x Nginx) that would handle
the SSL certificate and forward the requests to port 80, which should be made
externally available.
