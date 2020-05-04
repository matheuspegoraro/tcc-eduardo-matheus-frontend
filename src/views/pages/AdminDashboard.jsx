import React from "react";
import Chart from "chart.js";
import {
  Container,
} from "reactstrap";

import {
  chartOptions,
  parseOptions
} from "variables/charts.jsx";

import AdminHeader from "components/Headers/AdminHeader.jsx";

class AdminDashboard extends React.Component {
  state = {
    activeNav: 1,
    chartExample1Data: "data1"
  };
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);
    // this.chartReference.update();
  };
  componentWillMount() {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  render() {
    return (
      <>
        <AdminHeader />
        {/* Page content */}
        <Container className="mt-3 mb-4" fluid>
          
        </Container>
      </>
    );
  }
}

export default AdminDashboard;
