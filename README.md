# TempMail.lol JS API
<a href="https://npmjs.com/tempmail.lol">
    <img alt="npm" src="https://img.shields.io/npm/v/tempmail.lol">
</a>
<a href="https://discord.gg/GHapeHPWVS">
    <img alt="discord" src="https://discord.com/api/guilds/899020130091139082/widget.png">
</a>

This is an API for the temporary email service [TempMail.lol](https://tempmail.lol).

## If you are using a BananaCrumbs ID/Token and have not migrated, install version 3.1.0!!!

## Upgrading from 3.1.0

The only difference between 3.1.0 and 4.0.0 is the fact that the constructor only accepts an API Key, and not a BananaCrumbs ID.

## Upgrading from 2.0.3

The version 3.0.0+ is vastly different from the old version of the API.  Please read the changes before using the new version of the API.

Version 2.0.3 still works, but does not have support for custom domains or TempMail Plus.  Note that v2 support may be dropped at any time, so please
upgrade your applications as soon as possible.

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

### Types

Email:
```ts
type Email = {
    from: string,
    to: string,
    subject: string,
    body: string,
    html: string | null, //only if the email is HTML
    date: number, //date in unix millis
    ip: string, //IP address of sender
}
```

Inbox:
```ts
type Inbox = {
    address: string, //address of inbox
    token: string, //token to use for checkInbox
}
```

### Create inbox

To create an inbox:
```js

//simply, you can use the following function
tempmail.createInbox().then(inbox => {
    console.log(`Inbox: ${inbox.address} with a token of ${inbox.token}`);
});

//Or as async
const inbox: Inbox = await tempmail.createInbox();

//there are some advanced options as well

//whether or not to create a community address
const community = true;
tempmail.createInbox(community);


//or to use a specific domain
const domain = "cringemonster.com";
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

### Webhooks

You can set up a webhook to be called when an email is received.

```js
tempmail.setWebhook("https://example.com/webhook").then(() => {
    console.log("Webhook set!");
});
```

You can also remove the webhook:

```js
tempmail.removeWebhook().then(() => {
    console.log("Webhook removed!");
});
```

This feature is only available to TempMail Ultra subscribers.  Any email created after setting the webhook will trigger the webhook.
The email will not be returned in the `checkInbox` function.

Failed webhooks will not be retried unless a 429 Too Many Requests error is returned.

Webhooks will send data in a JSON format as an array of Email objects.
