# PBS Dealer App

![PBS Logo](./public/images/pbslogo.png)

## Description

The PBS Dealer App allows a user to enter important information describing a metal building and provides ways to export that information into MBS design software and generate contracts. We chose to use the Next.js framework with React components because this is an external application that requires authentication and we had an existing HTA application that our in-house team was familiar with. 

## Getting Started

First, install all your dependencies

```bash
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier nodemon concurrently @types/bcrypt three @types/three

npm install -save express jsonwebtoken bcryptjs dotenv
@fortawesome/fontawesome-free @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons next-pwa next react react-dom next-auth bcrypt mariadb @fortawesome/free-regular-svg-icons basic-ftp
```

Next, run the development server to ensure it is working:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploy on Vercel

This application is deployed through Vercel and will automatically update when changes are merged to the master branch

## How to Use the Project

