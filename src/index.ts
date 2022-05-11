#!

import Inbox from "./Inbox";
import Email from "./Email";

import fetch from "node-fetch";

const BASE_URL = "https://api.tempmail.lol";

/**
 * Create a new Inbox.
 * @param cb {function} Callback function.
 */
function createInbox(cb: (inbox: Inbox) => any): void {
    fetch(`${BASE_URL}/generate`).then(res => res.json()).then(json => {
        const inbox = new Inbox(json.address, json.token);
        cb(inbox);
    });
}

/**
 * Create a new Inbox asynchronously.
 * @returns {Promise<Inbox>} Promise with the Inbox.
 */
async function createInboxAsync(): Promise<Inbox> {
    const res = await fetch(`${BASE_URL}/generate`);
    const json = await res.json();
    return new Inbox(json.address, json.token);
}

/**
 * Check for new emails on an Inbox.
 * @param inbox {Inbox | string} Inbox or token string to check.
 * @param cb {function} Callback function.
 * @throws {Error} If the token is not valid.
 */
function checkInbox(inbox: Inbox | string, cb: (emails: Email[]) => any): void {
    
    //convert the token to an Inbox
    if(typeof inbox === "string") {
        inbox = new Inbox("", inbox);
    }
    
    fetch(`${BASE_URL}/auth/${inbox.token}`).then(res => res.json()).then(json => {
        if(json.token === "invalid") {
            throw new Error("Invalid token");
        }
        if(json.email === null) {
            return cb([]);
        }
        const emails = json.email.map((email: Email) => new Email(email.from, email.to, email.subject, email.body, email.html, email.date));
        cb(emails);
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
    return json.email.map((email: Email) => new Email(email.from, email.to, email.subject, email.body, email.html, email.date));
}

export {
    Inbox,
    Email,
    
    createInbox, createInboxAsync,
    checkInbox, checkInboxAsync,
};
