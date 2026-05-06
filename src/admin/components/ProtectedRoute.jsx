import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../hooks/useAuth';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                getToken() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/admin/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;
