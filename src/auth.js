import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt from 'jsonwebtoken';

const isAuth = () => {
    const token = localStorage.getItem('api_token');

    if(token == null)
        return false;

    const decoded = jwt.decode(token);

    if (decoded){
        if (decoded.exp >= Date.now() / 1000)
            return true;
    }

    localStorage.removeItem('api_token');
    return false;
}

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => 
            isAuth() ? (
                <Component {...props} />
            ) : (
                <Redirect 
                    to={{pathname: '/autenticar/login',
                        state: {from: props.location}
                        }} 
                />
            )
        }
        />
    );
}

export default PrivateRoute;