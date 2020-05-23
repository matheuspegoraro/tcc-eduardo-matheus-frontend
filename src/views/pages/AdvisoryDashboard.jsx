import React, { useEffect } from "react";
import Chart from "chart.js";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";

import {
  chartOptions,
  parseOptions
} from "variables/charts.jsx";

import ClientsMovimentsValues from '../../components/Charts/ClientsMovimentsValues';

import AdvisoryHeader from "components/Headers/AdvisoryHeader.jsx";

function AdvisoryDashboard() {

  useEffect(() => {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }, []);

  return (
    <>
      <AdvisoryHeader />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Dashboard</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <Row>
          <Col sm={12}>
            <Card className="shadow">
              <CardHeader className="bg-info">
                <Row>
                  <div className="col">
                    <h6 className="text-uppercase font-weight-bold text-white ls-1 mb-1">
                      RECEITAS X DESPESAS POR MÊS
                    </h6>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <ClientsMovimentsValues />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdvisoryDashboard;
