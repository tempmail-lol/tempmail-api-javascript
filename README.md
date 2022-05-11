# TempMail.lol JS API

This is an API for the temporary email service [TempMail.lol](https://tempmail.lol).

## Installation
```bash
npm i tempmail.lol
# or, if you use yarn
yarn add tempmail.lol
```

This has built-in types.

## Usage

### Create inbox

To create an inbox, you can use one of the following two functions:
```js
//with callback
createInbox((inbox) => {
    console.log(`Created new inbox: ${inbox.address}, token: ${inbox.token}`);
});

//async
createInboxAsync().then((inbox) => {
    console.log(`Created new inbox: ${inbox.address}, token: ${inbox.token}`);
});

//await
const inbox = await createInboxAsync();
```

### Retrieve emails

To get the emails (you can also pass in the Inbox object instead of a token string):
```js
//with callback
checkInbox("token", (emails) => {
    emails.forEach((e) => {
        console.log(JSON.stringify(e, null, 4));
    });
});

//async
checkInboxAsync("token").then((emails) => {
    emails.forEach((e) => {
        console.log(JSON.stringify(e, null, 4));
    });
});

//await
const emails = await checkInboxAsync("token");
```
