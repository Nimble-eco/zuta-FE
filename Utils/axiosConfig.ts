import axios from 'axios';

let host: string = "";
const env = process.env.NEXT_PUBLIC_ENV;
if (env && env?.toLocaleLowerCase() === 'production' || env?.toLocaleLowerCase() === 'staging') {
  host = process.env.NEXT_PUBLIC_API_BASEURL!;
} 
else {
  host = 'http://localhost:3333'
}

const axiosInstance = axios.create({
  baseURL: host
});

export default axiosInstance;