import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const response = await axios.get('https://server.food.test.ogwugo.xyz/api/auth/socialite/google');
    console.log({response})
    return response;
}