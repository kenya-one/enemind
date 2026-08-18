/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import dotenv from 'dotenv';
dotenv.config();

export interface SystemConfig {
  gemini: {
    apiKey: string | undefined;
    isConfigured: boolean;
    model: string;
  };
  google: {
    clientId: string | undefined;
    clientSecret: string | undefined;
    redirectUri: string | undefined;
    isConfigured: boolean;
    appUrl: string;
  };
  pesapal: {
    consumerKey: string | undefined;
    consumerSecret: string | undefined;
    ipnId: string | undefined;
    environment: 'sandbox' | 'live';
    isConfigured: boolean;
    baseUrl: string;
  };
  currency: {
    apiKey: string | undefined;
    isConfigured: boolean;
    baseCurrency: string;
  };
  admin: {
    apiSecret: string | undefined;
  };
}

const pesapalEnv = (process.env.PESAPAL_ENVIRONMENT || 'sandbox').toLowerCase() === 'live' ? 'live' : 'sandbox';
const pesapalBaseUrl = pesapalEnv === 'live' 
  ? 'https://pay.pesapal.com/v3' 
  : 'https://cybqa.pesapal.com/pesapalv3';

export const config: SystemConfig = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    isConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    model: 'gemini-3.7-flash',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    isConfigured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.trim().length > 0),
    appUrl: process.env.APP_URL || 'http://localhost:3000',
  },
  pesapal: {
    consumerKey: process.env.PESAPAL_CONSUMER_KEY,
    consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
    ipnId: process.env.PESAPAL_IPN_ID,
    environment: pesapalEnv,
    isConfigured: Boolean(
      process.env.PESAPAL_CONSUMER_KEY && 
      process.env.PESAPAL_CONSUMER_SECRET &&
      process.env.PESAPAL_CONSUMER_KEY.trim().length > 0
    ),
    baseUrl: pesapalBaseUrl,
  },
  currency: {
    apiKey: process.env.EXCHANGE_RATE_API_KEY,
    isConfigured: Boolean(process.env.EXCHANGE_RATE_API_KEY && process.env.EXCHANGE_RATE_API_KEY.trim().length > 0),
    baseCurrency: 'USD',
  },
  admin: {
    apiSecret: process.env.ADMIN_API_SECRET,
  },
};
