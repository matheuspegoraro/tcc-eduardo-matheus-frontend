/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "react-notification-alert/dist/animate.css";
import "assets/vendor/select2/dist/css/select2.min.css";
import "react-toastify/dist/ReactToastify.css"

import DashboardLayout from "layouts/Dashboard.jsx";
import AuthLayout from "layouts/Auth.jsx";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route
          path="/dashboard"
          render={props => <DashboardLayout {...props} />}
        />
        <Route path="/autenticar" render={props => <AuthLayout {...props} />} />
        <Redirect from="/" to="/dashboard/principal" />
      </Switch>
      <ToastContainer autoClose={3000} />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
