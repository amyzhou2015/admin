/**
 * Created by Riven on 2016/11/21.
 */

import cookie from 'react-cookie';
import ajax from 'axios';
import Seetings from '../../seetings';
import {Modal} from 'antd';
const ajaxHost = Seetings.seetings.ajaxHost;
const userName = cookie.load('userName');
const loginName = cookie.load('loginName');
const token = cookie.load('token');

export const isLoggedIn = (nextState, replace) => {
    if (!userName || !loginName || !token) {
        replace({
            pathname: '/login',
            state: {"lastRoute": nextState.location.pathname}
        });
    }
}

export const otherEnterHookHere = (nextState, replace) => {
    const replaceRoute = nextState.location.state && nextState.location.state.lastRoute ? nextState.location.state.lastRoute : "/";
    if (userName && loginName && token) {
        replace({
            pathname: '/',
        })
    }
}

export const logout = () => {
    cookie.remove('userName', {path: '/'});
    cookie.remove('loginName', {path: '/'});
    cookie.remove('token', {path: '/'});
    window.location.reload();
}

export const verifyLogin = (z) => {
    ajax({
        url: ajaxHost + "verifyLogin",
        method: "POST",
        data: {token: cookie.load('token'), loginName: cookie.load('loginName')},
    })
        .then(function (response) {
            if (response.status == 200) {
                var data = response.data;
                if (!data || !data.success || data.expired) {
                    Modal.warning({
                        title: "警告",
                        content: "登录已过期,请重新登录！",
                        onOk: logout,
                        okText: "确定"
                    })
                }
            } else {
                Modal.warning({
                    title: "警告",
                    content: "账号已在其他地方登录，请重新登录！",
                    onOk: logout,
                    okText: "确定"
                })
            }
        })
        .catch(function (error) {
            logout();
            console.log(error);
        })
}