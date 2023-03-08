import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";

const options = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENTID!,
        clientSecret: process.env.GOOGLE_SECRET!,
    }),
    FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENTID!,
        clientSecret: process.env.FACEBOOK_SECRET!,
    }),
    TwitterProvider({
        clientId: process.env.TWITTER_CLIENTID!,
        clientSecret: process.env.TWITTER_SECRET!,
    }),
  ],
  session: {
    maxAge: 30 * 24 
  },
  pages: {
    signIn: '/signIn',
  },
  
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);