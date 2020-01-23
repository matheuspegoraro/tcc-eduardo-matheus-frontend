import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt from 'jsonwebtoken';

const TOKEN_STORAGE = 'api_token';

const setToken = (token) => {
    localStorage.setItem(TOKEN_STORAGE, token);
}

const getToken = () => {
    return localStorage.getItem(TOKEN_STORAGE);
}

const removeToken = () => {
    localStorage.removeItem(TOKEN_STORAGE);  
}

const isAuth = () => {
    const token = getToken();

    if (token == null)
        return false;

    const decoded = jwt.decode(token);

    if (decoded) {
        if (decoded.exp >= Date.now() / 1000)
            return true;
    }

    removeToken();
    return false;
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props =>
            isAuth() ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: '/autenticar/login',
                            state: { from: props.location }
                        }}
                    />
                )
        }
        />
    );
}

export {PrivateRoute,
        setToken,
        getToken,
        removeToken
        };