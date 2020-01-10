import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuth = () => {
    //SEM SEGURANÇA AINDA, QUALQUER UM PODE COLOCAR UM TOKEN MANUAL
    if(localStorage.getItem('api_token') !== null){
        return true;
    } 
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