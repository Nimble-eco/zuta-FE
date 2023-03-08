import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const input = req.query.input;
        let response = await axios({
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=geocode&key=${process.env.GOOGLE_API_KEY}`,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
            }
        });

        return res.json({
            data: response.data,
            status: response.status,
        })
    } catch (error: any) {
        console.log(error.message);
    }
}
