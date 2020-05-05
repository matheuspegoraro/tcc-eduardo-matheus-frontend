import React, { useState, useEffect } from "react";

import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

import api from '../../axios';

import { formatShowMoney } from '../../utils';

function ClientHeader() {
  const [percentCurrentLiquidity, setPercentCurrentLiquidity] = useState(0);
  const [currentLiquidity, setCurrentLiquidity] = useState(0);

  const [percentProjectedLiquidity, setPercentProjectedLiquidity] = useState(0);
  const [projectedLiquidity, setProjectedLiquidity] = useState(0);

  useEffect(() => {

    async function fetchData() {
      const response = await api.get(`http://localhost:3333/client-dashboard/current-liquidity`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setPercentCurrentLiquidity(response.data.percentcurrentliquidity);
      setCurrentLiquidity(response.data.currentliquidity);
    }

    fetchData();

  }, []);

  useEffect(() => {

    async function fetchData() {
      const response = await api.get(`http://localhost:3333/client-dashboard/projected-liquidity`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setPercentProjectedLiquidity(response.data.percentprojectedliquidity);
      setProjectedLiquidity(response.data.projectedliquidity);
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
              <Col lg="6" xl="6">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          LIQUIDEZ ATUAL
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          R$ {formatShowMoney(currentLiquidity)}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className={`text-${percentCurrentLiquidity > 0 ? "success" : percentCurrentLiquidity < 0 ? "danger" : "info"} mr-2`}>
                        <i className={`fa fa-${percentCurrentLiquidity > 0 ? "arrow-up" : percentCurrentLiquidity < 0 ? "arrow-down" : "equals"}`} /> {formatShowMoney(percentCurrentLiquidity)}%
                      </span>{" "}
                      <span className="text-nowrap">Comparado ao mês passado</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="6">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          LIQUIDEZ PROJETADA
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          R$ {formatShowMoney(projectedLiquidity)}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className={`text-${percentProjectedLiquidity > 0 ? "success" : percentProjectedLiquidity < 0 ? "danger" : "info"} mr-2`}>
                        <i className={`fa fa-${percentProjectedLiquidity > 0 ? "arrow-up" : percentProjectedLiquidity < 0 ? "arrow-down" : "equals"}`} /> {formatShowMoney(percentProjectedLiquidity)}%
                      </span>{" "}
                      <span className="text-nowrap">Comparado ao mês passado</span>
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
