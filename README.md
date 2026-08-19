# Route Social — React Social App

Complete React + Vite social app connected to the Route Posts API.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Features

- Sign up, sign in, and token persistence.
- Protected routes for authenticated users.
- View, create, update, and delete posts.
- Post details with comment create, update, and delete actions.
- Profile page, photo upload, and user posts.
- Password change with refreshed token.
- Responsive English LTR interface.

The default API URL is configured in `src/services/api.js`. You can override it in `.env`:

```env
VITE_API_URL=https://route-posts.routemisr.com
```
