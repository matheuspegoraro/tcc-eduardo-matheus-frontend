import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import moment from 'moment';

import {
  Button,
  Card,
  CardHeader,
  Table,
  CardFooter,
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  UncontrolledTooltip
} from "reactstrap";

import HeaderWithDescription from "./../../components/Headers/HeaderWithDescription";
import api from '../../axios';


function Profile() {

  const [clients, setClients] = useState([]);

  const history = useHistory();

  useEffect(() => {

    (async () => {

      const { data } = await api.get('/relationship-company', {
        headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
      });

      setClients(data);

    })()

  }, []);


  return (
    <>
      <HeaderWithDescription
        title="Análise de Clientes"
        description="Permite ter acesso às informações dos cliente que faz parte de sua consultoria."
        color="primary"
      />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>

        <div>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
            <BreadcrumbItem active>Análise de Clientes</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <Row>
          <Col>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Clientes</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Iniciou em</th>
                    <th scope="col">Acessar</th>
                  </tr>
                </thead>
                <tbody>

                  {clients.map(client => {
                    return (
                      <tr key={client.id}>
                        <td>{client.clients.name}</td>
                        <td>
                          {moment(client.createdAt).add(3, "hours").format('DD/MM/YYYY')}
                        </td>
                        <td>

                          <a
                            className="fa fa-arrow-up text-green mr-2"
                            href="#"
                            style={{fontSize: 18}}
                            id="tooltip1"
                            onClick={() => history.push(`/app/receitas`, {
                              clientCompanyId: client.clients.id
                            })}
                          >
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip1"
                          >
                            Receitas
                          </UncontrolledTooltip>

                          <a
                            className="fa fa-arrow-down text-red mr-2"
                            href="#"
                            style={{fontSize: 18}}
                            id="tooltip2"
                            onClick={() => history.push(`/app/despesas`, {
                              clientCompanyId: client.clients.id
                            })}
                          >
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip2"
                          >
                            Despesas
                          </UncontrolledTooltip>

                          <a
                            className="fa fa-exchange-alt text-primary mr-2"
                            href="#"
                            style={{fontSize: 18}}
                            id="tooltip3"
                            onClick={() => history.push(`/app/transferencias`, {
                              clientCompanyId: client.clients.id
                            })}
                          >
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip3"
                          >
                            Transferencias
                          </UncontrolledTooltip>

                          <a
                            className="ni ni-money-coins text-warning mr-2"
                            href="#"
                            style={{fontSize: 18}}
                            id="tooltip4"
                            onClick={() => history.push(`/app/fluxo-de-caixa`, {
                              clientCompanyId: client.clients.id
                            })}
                          >
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip4"
                          >
                            Fluxo de Caixa
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    )
                  })}

                </tbody>
              </Table>
              <CardFooter>
                <p className="h5">Encontramos {clients.length} cliente(s) cadastradas(s).</p>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
