import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import SimpleLoader from "../../../../Components/loaders/SimpleLoader";

const callback = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      let isMounted = true;

      const base_url = process.env.NEXT_PUBLIC_API_BASEURL || "";
     
      const url = window.location.href.replace('#','?');
      const searchParams = new URLSearchParams(new URL(url).search);
      
      let access_token = searchParams.get('token');

      // Check if google login or apple login
      let socialite_url;
      let token;

      if (access_token) {
        socialite_url = `${base_url}/api/auth/google/callback`;
        token = access_token;
      }

      if(isMounted) {
        console.log({token, socialite_url})
        if (socialite_url && token) {
          setIsLoading(true);

          axios({
            url:socialite_url,
            method:'get',
            params: {
              token:token,
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res=>{
            setIsLoading(false);
            console.log({res});
            // router.push('/')
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

    }, [])

  return (
    <div className="w-full min-h-screen flex justify-center align-middle">
        {isLoading && <SimpleLoader />}
    </div>
  )
}

export default callback