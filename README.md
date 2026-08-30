# Waslah — Route Posts Social App

A React front-end for the [route-posts API](https://route-posts.routemisr.com), built for the
social media project assignment.

## Covers all required features
- Sign-up / Login (JWT stored in `localStorage`)
- Home page with all posts (feed)
- Post details page with all comments
- Profile page (your data + your posts)
- Create / Update / Delete posts
- Create / Update / Delete comments
- Change password

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## ⚠️ Before you submit — verify field names (5 minutes)

The public docs page lists every endpoint and the response shape, but the **request body
field names** for `signup`, `signin`, and `change-password` aren't shown there — that detail
is only in the linked Postman collection. This project already guesses the most common names
(`name`, `email`, `password`, `rePassword`, `oldPassword`, `newPassword`), but you should:

1. Open the Postman docs link from the course post.
2. Run `POST /users/signup` once and check the exact field names it expects.
3. If anything differs, open **`src/api/endpoints.js`** — every field name used by the whole
   app is defined in just two functions there (`signUp`, `signIn`, `changePassword`), so a
   mismatch takes one small edit, not a rewrite.

Same note for `deletePost` in that file — the docs table didn't explicitly list a
`DELETE /posts/:postId` route, so double check it exists as-is in Postman.

## Project structure

```
src/
  api/          axios client + every endpoint call
  context/      auth state (token/user) shared across the app
  components/   Navbar, PostCard, PostForm, CommentItem, ProtectedRoute
  pages/        SignUp, Login, Home, PostDetails, EditPost, Profile, ChangePassword
```

## Design

Visual identity: a "route" line running down the feed connecting each post like stops on a
path (a nod to Route Academy + the app's name "Waslah", Arabic for "connector"). Palette:
ink navy, cool paper background, indigo route accent, coral signal accent for likes.
