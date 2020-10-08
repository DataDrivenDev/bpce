import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import UserContext from '../shared/context/User';
import * as Cookies from "js-cookie";

import AuthService from '../services/auth/services';

import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'node_modules/react-month-picker/css/month-picker.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table-next';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import './styles.css';

interface AppProps {
  
}

interface AppState {
  clientKey : string,
  clientName : string,
  clientSurname : string,
  raisonSocial : string,
  setOfData : any[],
  filters : any,
  subscribtions : any[],
  options:number,
}


export default class MyApp extends App<AppProps,{},AppState> {

  constructor(props) {
    super(props);
    this.state= {
      clientKey : null,
      clientName : null,
      clientSurname : null,
      raisonSocial : null,
      subscribtions: [],
      options:0,
      setOfData : [],
      filters : {}
    }
  }

  redirectTo = (path = "/") => {
    Router.push(path);
  }

  userShouldBeChecked = async () => {
    /* external client key check */
    const clientKey = this.state.clientKey ? this.state.clientKey : Cookies.get('ddclientreact'),
          authService = new AuthService();
    
    if( clientKey !== undefined ){
      if( await authService.checkClientKey(clientKey) ){
        this.setState({ clientKey : clientKey });
        this.redirectTo( Router.route );
      } else {
        this.redirectTo( "/" );
      }
    }else {
      this.redirectTo("/");
    }
    return clientKey ? clientKey : null;
    
  }

  signIn = ( info ) => {
    
    Cookies.set('ddclientreact', info.clientKey, { expires: 365 });
    Cookies.set('ddoptions', info.options, { expires: 365 });
    Cookies.set('ddclientname', info.clientName, { expires: 365 });
    Cookies.set('ddclientsurname', info.clientSurname, { expires: 365 });
    Cookies.set('ddclientcoporatename', info.raisonSocial, { expires: 365 });

    this.setState({
      clientKey: info.clientKey,
      clientName: info.clientName,
      clientSurname: info.clientSurname,
      raisonSocial: info.raisonSocial,
      options: info.options
    }, () => {
      this.redirectTo('/statistics');
    });

  }

  signOut = (path = "/") => {

    Cookies.remove('ddclientreact');
    Cookies.remove('ddoptions');
    Cookies.remove('ddclientname');
    Cookies.remove('ddclientsurname');
    Cookies.remove('ddclientcoporatename');
    
    this.setState({
      clientKey : null,
      clientName: null,
      clientSurname: null,
      raisonSocial: null,
      options:0
    }, () => {
      this.redirectTo(path);
    });

  }

  setData = ( data ) => {
    this.setState({setOfData : data});
  }

  setFilters = ( filters ) => {
    this.setState({ filters : filters});
  }

  setSubscription = ( subscribtions ) => {
    this.setState({ subscribtions : subscribtions});
  }

  render() {
    const { Component, pageProps } = this.props;
    const userContext = {
      clientKey : this.state.clientKey, 
      clientName : this.state.clientName,
      clientSurname: this.state.clientSurname,
      raisonSocial: this.state.raisonSocial,
      setofdata: this.state.setOfData, 
      filters : this.state.filters,
      subscribtions : this.state.subscribtions, 
      options : this.state.options, 
      userShouldBeChecked : this.userShouldBeChecked,
      signIn : this.signIn, 
      signOut : this.signOut, 
      setData: this.setData,
      setFilters : this.setFilters,
      setSubscription : this.setSubscription
    }

    return (
      <UserContext.Provider value={userContext}>
        <Component {...pageProps} />
      </UserContext.Provider>
    )
  }
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }
  
