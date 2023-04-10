#!

import fetch from "node-fetch";

import Inbox from "./Inbox";
import Email from "./Email";

const BASE_URL = "https://api.tempmail.lol";

export class TempMail {
    
    constructor(
        private bananacrumbs_id?: string,
        private bananacrumbs_mfa?: string,
    ) {}
    
    private async makeRequest(url: string): Promise<any> {
        
        let headers = {
            "User-Agent": "TempMailJS/3.0.0"
        };
        
        //if the user is a TempMail Plus subscriber, add the credentials here
        if(this.bananacrumbs_id) {
            headers["X-BananaCrumbs-ID"] = this.bananacrumbs_id;
            headers["X-BananaCrumbs-MFA"] = this.bananacrumbs_mfa;
        }
        
        const raw = await fetch(BASE_URL + url, {
            headers,
        });
        
        //check for errors
        if(raw.status === 402) { //no time left
            throw new Error("BananaCrumbs ID has no more time left.");
        } else if(raw.status === 400 && this.bananacrumbs_id) { //invalid credentials
            throw new Error("Invalid BananaCrumbs credentials provided.");
        } else if(!raw.ok) { //other error
            throw new Error(`An error occurred while attempting to fetch data from the API: ${await raw.text()}`);
        }
        
        return await raw.json();
    }
    
    /**
     * Create a new inbox.
     * 
     * @param community {boolean} true to use community (formerly "rush mode") domains
     * @param domain {string} the specific domain to use.
     * @returns {Inbox} the Inbox object with the address and token.
     */
    async createInbox(community?: boolean, domain?: string): Promise<Inbox> {
        let url: string;
        
        //craft the URL to use
        if(domain) {
            url = "/generate/" + domain;
        } else {
            url = "/generate" + (community ? "/rush" : "");
        }
        
        const r = await this.makeRequest(url);
        
        return {
            address: r.address,
            token: r.token,
        };
    }
    
    /**
     * Check an inbox for emails.
     * 
     * @param authentication
     * @returns {Email[] | undefined} the Email array, or undefined if the inbox has expired.
     */
    async checkInbox(authentication: string | Inbox): Promise<Email[] | undefined> {
        const token = authentication instanceof Inbox ? authentication.token : authentication;
        
        const r = await this.makeRequest(`/auth/${token}`);
        
        if(r.token && r.token === "invalid") {
            return undefined;
        }
        
        return r.email;
    }
    
    /**
     * Check a custom domain.
     * 
     * Note that this requires a TempMail Plus subscription, as well as being logged in through `this` object.
     * 
     * @param domain {string} the domain to check.
     * @param token {string} the pre-SHA512 token to use for authentication.
     * @returns {Email[]} the emails, or undefined if there was an issue checking.
     */
    async checkCustomDomain(domain: string, token: string): Promise<Email[]> {
        
        const r = await this.makeRequest(`/custom/${token}/${domain}`);
        
        let emails: Email[];
        
        if(r.email === null) {
            emails = [];
        } else {
            emails = r.email;
        }
        
        return emails;
    }
    
}

export {
    Email, Inbox
};
