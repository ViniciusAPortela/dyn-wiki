import React from 'react'
import App from 'next/app';
import Head from 'next/head';
import './global.css';

class MyApp extends App {
    // Only uncomment this method if you have blocking data requirements for
    // every single page in your application. This disables the ability to
    // perform automatic static optimization, causing every page in your app to
    // be server-side rendered.
    //
    // static async getInitialProps(appContext) {
    //   // calls page's `getInitialProps` and fills `appProps.pageProps`
    //   const appProps = await App.getInitialProps(appContext);
    //
    //   return { ...appProps }
    // }
  
    render() {
      const { Component, pageProps } = this.props
      return(
        <>
          <Head>
            <link href="https://fonts.googleapis.com/css?family=Belgrano|Oleo+Script|Nobile|Muli|Acme|Alef:700|Righteous|Roboto:300,400&display=swap" rel="stylesheet"/>
          </Head>
          <Component {...pageProps} />
        </>
      );
    }
  }
  
  export default MyApp