/**
 * Created by Riven on 2016/11/15.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';
import Navigation from './components/Navigation';
import ProductBox from './components/ProductBox';
import NotFound from './components/404';
import modifyPwd from './components/sys/user/modifyPwd';
import login from './components/account/login';
import { isLoggedIn,otherEnterHookHere } from './components/account/authentication.js';

ReactDOM.render(<Router history={browserHistory}>
    <Route path="/login" component={login} onEnter={otherEnterHookHere} />
    <Route path="/" component={Navigation} onEnter={isLoggedIn}>
      <IndexRoute component={ProductBox}/>
      <Route path="sys/user/modifyPwd" component={modifyPwd}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
  , document.getElementById('content'));

