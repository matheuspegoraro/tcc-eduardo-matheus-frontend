import React from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

import MovimentsValues from '../../components/Charts/MovimentsValues';

import ClientHeader from "components/Headers/ClientHeader.jsx";

class Index extends React.Component {
  render() {
    return (
      <>
        <ClientHeader />
        {/* Page content */}
        <Container className="mt-3 mb-4" fluid>
          <Card className="shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h6 className="text-uppercase text-light ls-1 mb-1">
                    RECEITAS X DESPESAS POR MÊS
                  </h6>
                  <h2 className="text-white mb-0">Sales value</h2>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              <MovimentsValues />
            </CardBody>
          </Card>
      </Container>
      </>
    );
  }
}

export default Index;
