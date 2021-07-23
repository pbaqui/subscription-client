import BackApi from 'apis/BackApi.js';
import history from '../utils/History';
import qs from 'querystring';

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const signin = async (email, password) => {
  try {
    const response = await BackApi.post(
      '/signin', qs.stringify({
          email : email,
          password : password
      })
      , config);

    let user = {
      user : response.data.user,
      token : `Bearer ${ response.data.token}`
    }
    
    localStorage.setItem('sc-user',  JSON.stringify(user));

    // BackApi.defaults.headers.common['Authorization'] = user.token;
    return { status: 'OK' };
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const getUserAuthenticated = () => {
  let user =  JSON.parse(localStorage.getItem('sc-user'));
  return user ? user : undefined;
}

const signout = async () => {
  try {
    clearToken();
    history.push(`/signin`);
    return { status: 'OK' };
  } catch (err) {
    return { status: 'ERR', message: err };
  }
};

const clearToken = () => {
  localStorage.removeItem('sc-user');
  BackApi.defaults.headers.common['Authorization'] = '';
}

const isAuthenticated = () => {
  return getUserAuthenticated() ? true : false;
}

export default {
    signin : signin,
    signout : signout,
    getUserAuthenticated : getUserAuthenticated,
    isAuthenticated : isAuthenticated,
    clearToken : clearToken
}

