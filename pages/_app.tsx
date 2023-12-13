import "@/styles/globals.css";
import { useEffect } from "react";
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/redux/store';

// api
import { setAPIToken } from "./api";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jwt_token = localStorage.getItem('token');
    if (jwt_token) setAPIToken(jwt_token);
  }, [])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
