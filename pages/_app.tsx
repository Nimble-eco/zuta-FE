import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";
import UsePageLoading from '../Components/hooks/UsePageLoading';
import PageLoadingSkeleton from '../Components/loaders/PageLoadingSkeleton';

function MyApp({ Component, pageProps }: AppProps) {
  const { isPageLoading } = UsePageLoading();

  if(typeof window !== 'undefined') injectStyle();

  return (
    <>
      {
        isPageLoading ? (
          <PageLoadingSkeleton />
        ) : (
          <>
            <ToastContainer />
            <Component {...pageProps} />
          </>
        )
      }
    </>
  )
}

export default MyApp
