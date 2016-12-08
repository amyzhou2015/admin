/**
 * Created by Riven on 2016/11/15.
 */

import React from 'react';
import {render} from 'react-dom'
import Router from 'react-router/lib/Router'
import browserHistory from 'react-router/lib/browserHistory'
import {isLoggedIn, haveLogined} from './components/account/authentication.js';
import '../assets/css/global.scss';

const loginRoute = {
    path: '/login',
    getComponents(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('./components/account/login'))
        }, 'login')
    },
    onEnter: haveLogined
}

const rootRoute = {
    path: '/',
    getComponents(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('./components/Navigation').default)
        }, 'navigation')
    },
    getIndexRoute(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('./routes/index'))
        }, 'hello')
    },

    getChildRoutes(location, callback) {
        require.ensure([], function (require) {
            callback(null, [
                require('./routes/sys/menu/index'),
                require('./routes/sys/user/index'),
                require('./routes/contentCenter/banner/index'),
                require('./routes/notFound'),
            ])
        },'child')
    },
    onEnter: isLoggedIn
}

render(<Router
        history={browserHistory}
        routes={[loginRoute, rootRoute]}
    />
    , document.getElementById('content'))

