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