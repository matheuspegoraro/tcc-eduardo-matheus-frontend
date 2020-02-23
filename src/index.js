import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "react-notification-alert/dist/animate.css";
import "assets/vendor/select2/dist/css/select2.min.css";

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
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
