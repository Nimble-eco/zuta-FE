import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import SimpleLoader from "../../../../Components/loaders/SimpleLoader";
import Cookies from "js-cookie";
import Header from "../../../../Components/Header";

const callback = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      let isMounted = true;

      const base_url = process.env.NEXT_PUBLIC_API_BASEURL || "";
     
      const url = window.location.href.replace('#','?');
      const searchParams = new URLSearchParams(new URL(url).search);
      
      let access_token = searchParams.get('token');

      let token;

      if (access_token) {
        token = access_token;
      }

      if(isMounted) {
        if (token) {
          setIsLoading(true);

          axios.post(
            `${base_url}/api/auth/user/token`, {token}, {
              headers: {
                Authorization: token
              }
            }
          )
          .then(res=>{
            setIsLoading(false);
            Cookies.set('user', JSON.stringify(res.data.data))
            toast.success('Sign in successful');
            setTimeout(() => router.push('/'), 3000)
          })
          .catch(err=> {
            setIsLoading(false);
            console.log({err});
          });
        }
      }

      return () => {
        isMounted = false;
      }

    }, []);

    if(typeof window !== 'undefined') injectStyle();

    return (
      <div className="w-full min-h-screen flex justify-center align-middle flex flex-col relative">
        <div className="fixed top-0 left-0 right-0">
          <Header search={false}/>
        </div>

        <ToastContainer />

        {isLoading && <SimpleLoader />}
      </div>
    );
}

export default callback