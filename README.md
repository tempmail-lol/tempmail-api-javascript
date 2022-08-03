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
createInbox((inbox, err) => {
    if(err) {
        return console.error(err);
    }
    
    console.log(`Created new inbox: ${inbox.address}, token: ${inbox.token}`);
}, false); //set to true to use Rush Mode domains.

//read more about Rush Mode: https://tempmail.lol/news/2022/08/03/introducing-rush-mode-for-tempmail/

//async
createInboxAsync(false).then((inbox) => { //set to true to use Rush Mode domains.
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
