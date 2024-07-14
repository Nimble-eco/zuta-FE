import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";

function MyApp({ Component, pageProps }: AppProps) {
  if(typeof window !== 'undefined') injectStyle();

  return (
    <>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
