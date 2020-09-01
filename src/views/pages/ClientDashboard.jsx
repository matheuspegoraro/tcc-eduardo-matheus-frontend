import React, { useState, useEffect } from "react";
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

import MovimentsValues from '../../components/Charts/MovimentsValues';
import HigherCategorySpending from '../../components/Charts/HigherCategorySpending';

import ClientHeader from "components/Headers/ClientHeader.jsx";

function Index(props) {

  const [clientCompanyId, setClientCompanyId] = useState(0);

  useEffect(() => {
    if(props.location.state) {
        localStorage.setItem('clientCompanyId', props.location.state.clientCompanyId);
    }

    setClientCompanyId(parseInt(localStorage.getItem('clientCompanyId')));
  }, []);

  return (
    <>
      <ClientHeader />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>
      <div>
        <Breadcrumb>
          <BreadcrumbItem active>Dashboard</BreadcrumbItem>
        </Breadcrumb>
      </div>
      
        <Row>
          <Col sm={8}>
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
                <MovimentsValues />
              </CardBody>
            </Card>
          </Col>
          <Col sm={4}>
          <Card className="shadow">
              <CardHeader className="bg-info">
                <Row>
                  <div className="col">
                    <h6 className="text-uppercase font-weight-bold text-white ls-1 mb-1">
                      TOP 5 CATEGORIAS COM MAIS GASTOS
                    </h6>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <HigherCategorySpending />
              </CardBody>
            </Card>
          </Col>
        </Row>
    </Container>
    </>
  );
}

export default Index;
