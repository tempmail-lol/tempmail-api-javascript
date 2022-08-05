#!

import fetch from "node-fetch";

import Inbox from "./Inbox";
import Email from "./Email";

const BASE_URL = "https://api.tempmail.lol";

/**
 * Create a new Inbox.
 * @param cb {function} Callback function.
 * @param rush {boolean} (optional) Enable Rush Mode (see https://tempmail.lol/news/2022/08/03/introducing-rush-mode-for-tempmail/).
 */
function createInbox(cb: (inbox: Inbox | undefined, err: Error | null) => any, rush = false): void {
    fetch(`${BASE_URL}/generate${rush ? "/rush" : ""}`).then(res => res.json()).then((json) => {
        const inbox = new Inbox(json.address, json.token);
        cb(inbox, null);
    }).catch((err) => {
        cb(undefined, err);
    });
}

/**
 * Create a new Inbox asynchronously.
 * 
 * @param rush {boolean} (optional) Enable Rush Mode (see https://tempmail.lol/news/2022/08/03/introducing-rush-mode-for-tempmail/).
 * @returns {Promise<Inbox>} Promise with the Inbox.
 */
async function createInboxAsync(rush: boolean = false): Promise<Inbox> {
    const res = await fetch(`${BASE_URL}/generate${rush ? "/rush" : ""}`);
    const json = await res.json();
    return new Inbox(json.address, json.token);
}

/**
 * Check for new emails on an Inbox.
 * @param inbox {Inbox | string} Inbox or token string to check.
 * @param cb {function} Callback function.
 */
function checkInbox(inbox: Inbox | string, cb: (emails: Email[], err: Error | null) => any): void {
    
    //convert the token to an Inbox
    if(typeof inbox === "string") {
        inbox = new Inbox("", inbox);
    }
    
    fetch(`${BASE_URL}/auth/${inbox.token}`).then(res => res.json()).then(json => {
        if(json.token === "invalid") {
            cb([], new Error("Invalid token"));
        }
        if(json.email === null) {
            return cb([], null);
        }
        const emails = json.email.map((email: Email) => new Email(email.from, email.to, email.subject, email.body, email.html, email.date, email.ip));
        cb(emails, null);
    });
}

/**
 * Check for new emails on an Inbox asynchronously.
 * 
 * @param inbox {Inbox | string} Inbox or token string to check.
 * @returns {Promise<Email[]>} Promise with the emails.
 * @throws {Error} If the token is invalid.
 */
async function checkInboxAsync(inbox: Inbox | string): Promise<Email[]> {
    
    //convert the token to an Inbox
    if(typeof inbox === "string") {
        inbox = new Inbox("", inbox);
    }
    
    const res = await fetch(`${BASE_URL}/auth/${inbox.token}`);
    const json = await res.json();
    if(json.token === "invalid") {
        throw new Error("Invalid token");
    }
    if(json.email === null) {
        return [];
    }
    return json.email.map((email: Email) => new Email(email.from, email.to, email.subject, email.body, email.html, email.date, email.ip));
}

export {
    Inbox,
    Email,
    
    createInbox, createInboxAsync,
    checkInbox, checkInboxAsync,
};
