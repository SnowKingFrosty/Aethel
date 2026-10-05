# Aethel

## Firebase setup

The app uses Firebase Authentication (email/password), Cloud Firestore for profiles, storefronts, posts, chat rooms and messages, and Cloud Storage for uploaded media. Registered names stay in the owner-only profile document; public posts, rooms, and messages use usernames. On sign-in, the app removes legacy registered-name fields from that user's existing public posts, rooms, and messages. The web app configuration is in `firebase.js`; its API key identifies the Firebase app and is not a server secret. Access is enforced by the Firestore and Storage security rules.

Before using cloud features:

1. In the Firebase console for `aethel-30d56`, open **Authentication → Get started → Sign-in method** and enable **Email/Password**. Also confirm `aethel-30d56.firebaseapp.com` (and your deployed site's host) appear under **Authentication → Settings → Authorized domains**.
2. Create a Cloud Firestore database and a Cloud Storage bucket.
3. Deploy the included access rules from this directory:

   ```sh
   firebase login
   firebase deploy --only firestore:rules,storage
   ```

4. Serve the site over HTTP (ES modules do not work from a `file://` URL), for example:

   ```sh
   python3 -m http.server 8000
   ```

The app reports Firebase connection and permission errors in its status banner. Room chat includes an emoji picker and searchable KLIPY GIFs. The KLIPY key is kept in a Firebase Functions secret and is never sent to the browser. Configure and deploy the GIF search function with:

```sh
firebase functions:secrets:set KLIPY_API_KEY
firebase deploy --only functions:searchKlipyGifs,firestore:rules
```

When prompted, enter the app key issued by KLIPY. GIF search requires a signed-in Aethel account. Profile, storefront, chat-room, post, and chat data is stored in Firestore; uploaded images and videos are stored in Cloud Storage so they do not exceed Firestore's document-size limit.

Firebase Functions deployment requires the project to be on the Blaze (pay-as-you-go) plan. The function limits each request to 24 GIF results and only returns HTTPS media hosted by `static.klipy.com`.
