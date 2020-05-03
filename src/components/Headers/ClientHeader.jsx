import React, { useState, useEffect } from "react";

import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

import api from '../../axios';

import { formatShowMoney } from '../../utils';

function ClientHeader() {
  const [percentBalancesheet, setPercentBalancesheet] = useState(0);
  const [balancesheet, setBalancesheet] = useState(0);

  useEffect(() => {

    async function fetchData() {
      const response = await api.get(`http://localhost:3333/client-dashboard/monthly-increase`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setPercentBalancesheet(response.data.percentbalancesheet);
      setBalancesheet(response.data.balancesheet);
    }

    fetchData();

  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-4 pt-6">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Balanço de Caixa
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          R$ {formatShowMoney(balancesheet)}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className={`text-${percentBalancesheet > 0 ? "success" : percentBalancesheet < 0 ? "danger" : "info"} mr-2`}>
                        <i className={`fa fa-${percentBalancesheet > 0 ? "arrow-up" : percentBalancesheet < 0 ? "arrow-down" : "equals"}`} /> {formatShowMoney(percentBalancesheet)}%
                      </span>{" "}
                      <span className="text-nowrap">Comparado ao mês passado</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          New users
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          2,356
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last week</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Sales
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">924</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fas fa-arrow-down" /> 1.10%
                      </span>{" "}
                      <span className="text-nowrap">Since yesterday</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

export default ClientHeader;
