# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying for Free with Firebase

You can deploy and host this application for free using the Firebase "Spark" plan, which has a generous free tier for hosting, database usage, and more.

### Prerequisites

1.  **Node.js**: Make sure you have Node.js installed on your machine.
2.  **Firebase CLI**: If you don't have it, install the Firebase Command Line Interface globally by running:
    ```bash
    npm install -g firebase-tools
    ```

### Deployment Steps

1.  **Login to Firebase**:
    Open your terminal in your project's folder and log in to your Google account:
    ```bash
    firebase login
    ```

2.  **Initialize Firebase in your project**:
    In the root directory of this project, run the initialization command. This safely creates configuration files without overwriting your app code.
    ```bash
    firebase init hosting
    ```
    - When prompted, choose to **Use an existing project** (or create a new one if you haven't already).
    - When asked for your public directory, just press **Enter**. Firebase is smart and will detect your Next.js setup from the `apphosting.yaml` file.
    - When asked to "Configure as a single-page app", answer **No (N)**, as Next.js handles its own routing.
    - This will create a `.firebaserc` file (to link to your Firebase project) and a `firebase.json` file (for hosting configuration).

3.  **Deploy your app**:
    After initialization is complete, simply run the deploy command:
    ```bash
    firebase deploy
    ```

And that's it! The Firebase CLI will build your Next.js application and deploy it. After a few moments, it will give you a public URL where you can see your live Tic-Tac-Toe Arena.

## Other Free Hosting Options

While Firebase Hosting is an excellent and well-integrated choice, the web development ecosystem offers several other fantastic platforms for deploying Next.js applications for free. Here are a couple of popular alternatives:

### Vercel

Vercel is the company behind Next.js, so their hosting platform is purpose-built for it. They offer a generous free tier that's perfect for personal projects and prototypes. Deployment is often as simple as connecting your Git repository.

### Netlify

Netlify is another top-tier platform that provides continuous deployment, serverless functions, and a robust free tier. It's known for its ease of use and powerful features that work great with Next.js.

Both Vercel and Netlify offer seamless deployment experiences, typically by linking to your GitHub, GitLab, or Bitbucket account and automatically building and deploying your app whenever you push a change.

## Environment Variables for Hosting

When you deploy your application to a hosting provider like Vercel or Netlify, it needs to know your Firebase project's secret credentials to connect to your database. These are managed through **Environment Variables**.

Your Firebase configuration is stored in variables like `NEXT_PUBLIC_FIREBASE_PROJECT_ID`. In the Firebase Studio preview, these are automatically provided for you. However, on an external service, you must add them yourself.

### Steps to Configure Environment Variables on Netlify/Vercel:

1.  **Find Your Firebase Credentials**:
    *   Go to your [Firebase Console](https://console.firebase.google.com/).
    *   Select your project.
    *   Click the **Gear icon** next to "Project Overview" and select **Project settings**.
    *   In the "General" tab, scroll down to the "Your apps" section.
    *   Click on your web app (or create one if you haven't).
    *   Select the **"Config"** radio button to see the `firebaseConfig` object. It will look like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "12345...",
      appId: "1:12345..."
    };
    ```

2.  **Add Variables to Your Hosting Provider**:
    *   Go to your project's dashboard on Netlify or Vercel.
    *   Find the settings for **Environment Variables** (on Netlify, it's under `Site settings > Build & deploy > Environment`).
    *   In the Netlify dashboard, you will add a new environment variable for each of the following keys. The **Key** is the name on the left, and the **Value** is what you will copy from your Firebase project settings.

| Key (in Netlify) | Value (from your Firebase config) |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | The `apiKey` value |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | The `authDomain` value |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | The `projectId` value |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | The `storageBucket` value |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| The `messagingSenderId` value |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | The `appId` value |


3.  **Redeploy**:
    *   After adding the variables, trigger a new deployment on your hosting provider. Your app should now be able to connect to Firebase successfully.

**(Optional) For Local Development:**

If you were running this project on your own computer (outside of Firebase Studio), you would create a file named `.env.local` in the project's root directory and add the variables there:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value_here
...
```

## What to Deploy

When you use a modern hosting platform like Firebase, Vercel, or Netlify, you typically **don't upload files or folders manually**. Instead, you connect the hosting service to your Git repository (e.g., on GitHub). The service then automatically runs the build process and deploys your application.

Your repository should contain all of your project's source code. Essentially, this is every file you see in the project, with the major exception of the `node_modules` folder, which is generated automatically by the hosting provider.

Here are the key files and folders that need to be in your repository for a successful deployment:

*   **`src/`**: Contains all your application source code, including pages and components.
*   **`package.json`**: Lists all your project's dependencies. This is crucial for the hosting provider to install the necessary packages.
*   **`next.config.ts`**: The configuration file for Next.js.
*   **`tailwind.config.ts`**: The configuration for your app's styling.
*   **`tsconfig.json`**: The TypeScript configuration.
*   **`apphosting.yaml`**: Firebase App Hosting configuration.
*   **`.firebaserc` & `firebase.json`**: Firebase project configuration (created after running `firebase init`).
*   **`README.md`**: This file!

You do **not** need to upload:

*   **`node_modules/`**: This folder contains all the installed packages and can be very large. The hosting service will install these for you based on your `package.json`.
*   **`.next/`**: This is the build output folder. The hosting service will create this for you when it builds your project.
