/**
 * Created by Riven on 2016/11/21.
 */

import cookie from 'react-cookie';
import request from 'request-promise';
import Seetings from '../../seetings';
import {Menu, Icon, Row, Col, Popconfirm, Dropdown, Badge,Modal} from 'antd';
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
    request({
        url: ajaxHost + "verifyLogin",
        method: "POST",
        form: {token: cookie.load('token'), loginName: cookie.load('loginName')},
    })
        .then(function (response) {
            var data = JSON.parse(response);
            if (!data || !data.success || data.expired) {
                Modal.warning({
                    title:"警告",
                    content:"账号已在其他地方登录，请重新登录！",
                    onOk:logout,
                    okText:"确定"
                })
            }
        })
        .catch(function (err) {
            Modal.warning({
                title:"警告",
                content:"账号已在其他地方登录，请重新登录！",
                onOk:logout,
                okText:"确定"
            })
        });
}