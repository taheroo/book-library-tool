// // reference: https://developers.google.com/identity/protocols/oauth2/web-server#node.js
// import { google } from "googleapis";
// import * as crypto from "crypto";

// /**
//  * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
//  * from the client_secret.json file. To get these credentials for your application, visit
//  * https://console.cloud.google.com/apis/credentials.
//  */
// const oauth2Client = new google.auth.OAuth2(
//   process.env.GMAIL_CLIENT_ID,
//   process.env.GMAIL_CLIENT_SECRET,
//   "http://localhost"
// );

// // Access scopes for read-only Drive activity.
// const scopes = ["https://mail.google.com/"];

// // Generate a secure random state value.
// const state = crypto.randomBytes(32).toString("hex");

// // Generate a url that asks permissions for the Drive activity scope
// const authorizationUrl = oauth2Client.generateAuthUrl({
//   // 'online' (default) or 'offline' (gets refresh_token)
//   access_type: "offline",
//   /** Pass in the scopes array defined above.
//    * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
//   scope: scopes,
//   // Enable incremental authorization. Recommended as a best practice.
//   include_granted_scopes: true,
//   // Include the state parameter to reduce the risk of CSRF attacks.
//   state: state,
// });

// console.log(authorizationUrl);

// // import { google } from "googleapis";
// // const oauth2Client = new google.auth.OAuth2(
// //   process.env.GMAIL_CLIENT_ID,
// //   process.env.GMAIL_CLIENT_SECRET,
// //   "http://localhost"
// // );

// // async function getTokens(code) {
// //   const { tokens } = await oauth2Client.getToken(code);
// //   console.log(tokens); // tokens contains refreshToken and accessToken
// // }

// // // Call getTokens with the code from the URL query
// // getTokens("TOKEN_FROM_URL_QUERY");
