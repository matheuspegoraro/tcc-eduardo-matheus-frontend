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

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "react-notification-alert/dist/animate.css";

import DashboardLayout from "layouts/Dashboard.jsx";
import AuthLayout from "layouts/Auth.jsx";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/dashboard" render={props => <DashboardLayout {...props} />} />
      <Route path="/autenticar" render={props => <AuthLayout {...props} />} />
      <Redirect from="/" to="/dashboard/principal" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
