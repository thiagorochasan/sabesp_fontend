import '../../styles/globals.scss'
import { AppProps } from 'next/app';

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
        <Component {...pageProps} />
        <ToastContainer autoClose={3000}></ToastContainer>
    </div>
  )
}
