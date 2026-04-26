import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react"; 
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import SimpleLoader from "../../../../Components/loaders/SimpleLoader";
import Cookies from "js-cookie";
import Header from "../../../../Components/Header";

const Callback = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (hasCalledApi.current) return;

    const base_url = process.env.NEXT_PUBLIC_API_BASEURL || "";
    
    const url = window.location.href.replace('#', '?');
    const searchParams = new URLSearchParams(new URL(url).search);
    let token = searchParams.get('token');

    if (token) {
      hasCalledApi.current = true;
      setIsLoading(true);

      axios.post(
        `${base_url}/api/auth/user/token`, 
        { token }, 
        {
          headers: {
              Authorization: token 
          }
        }
      )
      .then(res => {
        setIsLoading(false);
        Cookies.set('user', JSON.stringify(res.data.data));
        toast.success('Sign in successful');
        
        setTimeout(() => router.push('/'), 2000);
      })
      .catch(err => {
        setIsLoading(false);
        console.error({ err });
        toast.error(err.response?.data?.message || 'Authentication failed');
        // Optional: hasCalledApi.current = false; // Uncomment if you want to allow retry on error
      });
    }
  }, [router.isReady]); 

  if (typeof window !== 'undefined') injectStyle();

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header search={false} />
      </div>

      <ToastContainer />

      <div className="text-center space-y-4">
        {isLoading ? (
          <>
            <SimpleLoader />
            <p className="text-gray-500 animate-pulse">Finalizing your secure sign-in...</p>
          </>
        ) : (
          <p className="text-gray-400">Verifying credentials...</p>
        )}
      </div>
    </div>
  );
}

export default Callback;