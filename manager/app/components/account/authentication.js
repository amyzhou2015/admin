/**
 * Created by Riven on 2016/11/21.
 */

import cookie from 'react-cookie';
const userName = cookie.load('userName');

export const isLoggedIn = (nextState, replace) => {
  if(!userName){
    replace({
      pathname: '/login',
      state:{"lastRoute":nextState.location.pathname}
    });
  }
}

export const otherEnterHookHere =(nextState,replace) => {
  const replaceRoute = nextState.location.state&&nextState.location.state.lastRoute? nextState.location.state.lastRoute:"/";
  if(userName){
    replace({
      pathname: '/',
    })
  }
}