# DevOps & DSA Consistency Tracker

A full-stack interactive Next.js web application designed to help you track your learning progress for DSA concepts and DevOps tools. Features an automatic schedule generator, chronological timeline, customizable tasks, and progress indicators.

## Features

- **Progress Overview**: A dynamic header calculating overall completion percentage.
- **Task Management**: Create, edit, update, or delete tasks.
- **Auto-Scheduling**: Automatically generate your study schedule based on the predefined timeline right from your actual starting date.
- **Timeline View**: Visual timeline representation mapping events sequentially.
- **Serverless API Backend**: Handled effortlessly through Next.js API Routes.
- **MongoDB Next.js Integration**: Persists your progress seamlessly.
- **Tailwind CSS Styling**: Modern, clean, and interactive user interface.

## Tech Stack

- **Frontend**: React, Next.js 15, Tailwind CSS, Lucide Icons, Date-Fns.
- **Backend**: Node.js, Next.js Serverless API routes.
- **Database**: MongoDB, Mongoose.

## Getting Started Locally

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your MongoDB connection string (Mongoose connection URIs works perfectly, both locally and via MongoDB Atlas):
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/devops-tracker?retryWrites=true&w=majority
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). If your database is empty, press the **Generate Schedule** button on the dashboard to populate the predefined DevOps and DSA learning timeline.

## Deploying to Vercel

The easiest way to put this app in production is to deploy on [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository.
2. Link your repository to a new Vercel Project.
3. In the Vercel project settings, set your `MONGODB_URI` environment variable before deploying. 
4. Click **Deploy**. Vercel will build the Next.js app and optimize it automatically.
