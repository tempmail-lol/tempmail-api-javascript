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

You can also specify a parameter after the rush mode parameter to specify the domain of the inbox. For example:
```js
createInbox((inbox, err) => {
    if(err) {
        return console.error(err);
    }
    
    console.log(`Created new inbox: ${inbox.address}, token: ${inbox.token}`);
}, false, "example.com");
```

Will create an inbox with the address `example.com`.

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

### Custom Domains

Starting September 1st, you can use custom domains with this API. To use a custom domain, you can use the following function:
```js
//with callback
checkCustom("example.com", "abcdefg...", (emails) => {
    emails.forEach((e) => {
        console.log(JSON.stringify(e, null, 4));
    });
});

//async
checkCustomAsync("example.com", "abcdefg...").then((emails) => {
    emails.forEach((e) => {
        console.log(JSON.stringify(e, null, 4));
    });
});

//await
const emails = await checkCustomAsync("example.com", "abcdefg...");
```

Custom domains will NOT alert you if the token is invalid.
