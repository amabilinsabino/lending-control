import type { AppProps } from "next/app";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { store } from '../store/store'
import { Provider } from 'react-redux'


const theme = createTheme({
  palette: {
    background: { default: '#f5f5f5' }
  }

  // Your theme options go here
});

export default function App({ Component, pageProps }: AppProps) {
  return <ThemeProvider theme={theme}>
    <Provider store={store}>
      <CssBaseline />
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  </ThemeProvider>

}
