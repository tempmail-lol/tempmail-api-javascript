# TempMail.lol JS API
<a href="https://npmjs.com/tempmail.lol">
    <img alt="npm" src="https://img.shields.io/npm/v/tempmail.lol">
</a>
<a href="https://discord.gg/GHapeHPWVS">
    <img alt="discord" src="https://discord.com/api/guilds/899020130091139082/widget.png">
</a>

This is an API for the temporary email service [TempMail.lol](https://tempmail.lol).

## Installation
```bash
npm i tempmail.lol
# or, if you use yarn
yarn add tempmail.lol
```

This has built-in types.

## Usage

First, create a TempMail object:
```js
const tempmail = new TempMail();

//if you have a TempMail Plus account, you can add it here:
const tempmail = new TempMail("24-number id", "32-character token");
```

### Create inbox

To create an inbox:
```js

//simply, you can use the following function
tempmail.createInbox().then(inbox => {
    console.log(`Inbox: ${inbox.address} with a token of ${inbox.token}`);
});

//there are some advanced options as well

//whether or not to create a community address
const community = false;
tempmail.createInbox(community);


//or to use a custom domain
const domain = "example.com";
tempmail.createInbox(false, domain);
```

Note that all inboxes expire after 10 minutes since last check, with a hard expiry limit of one hour that cannot be bypassed.

TempMail Plus subscribers can extend this to TEN hours, but the 10-minute check rule still applies.

### Retrieve emails

To get the emails in an inbox:
```js

//you can also pass through the Inbox object instead of the token string
const emails = tempmail.checkInbox("<TOKEN>").then((emails) => {
    if(!emails) {
        console.log(`Inbox expired since "emails" is undefined...`);
        return;
    }
    
    console.log(`We got some emails!`);
    
    for(let i = 0; i < emails.length; i++) {
        console.log(`email ${i}: ${JSON.stringify(emails[i])}`);
    }
});
```

### Custom Domains

#### Note: you will need to be a TempMail Plus subscriber to use custom domains!

```js
tempmail.checkCustomDomain("example.com", "token").then(emails => {
    //woohoo, emails!
});
```

You can obtain a token by visiting https://tempmail.lol/custom.html

Custom domains will NOT alert you if the token is invalid.
