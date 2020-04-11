import React, { useState, useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";

import { Container } from "reactstrap";

import DashboardNavbar from "components/Navbars/DashboardNavbar.jsx";
import DashboardFooter from "components/Footers/DashboardFooter.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import { PrivateRoute } from '../auth';

import routesList from "routes.js";

function Dashboard(props) {
  const mainContent = useRef(null);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;

    setRoutes(routesList);
  }, []);

  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/app") {
        if (prop.private) {
          return (
            <PrivateRoute
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          )
        } else {
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          )
        }
      } else if (prop.layout !== null) {
        return null;
      } else {
        return getRoutes(prop.children)
      }
    });
  };

  const getBrandText = path => {
    // Consertar para pegar o brandText dos submenus

    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/dashboard/principal",
          imgSrc: require("assets/img/brand/argon-react.png"),
          imgAlt: "..."
        }}
      />
      <div className="main-content" ref={mainContent}>
        <DashboardNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>{getRoutes(routes)}</Switch>
        <Container fluid>
          <DashboardNavbar />
          <DashboardFooter />
        </Container>
      </div>
    </>
  );
}

export default Dashboard;
