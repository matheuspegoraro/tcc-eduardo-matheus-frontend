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
  BreadcrumbItem
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
                    <th scope="col">Despesas</th>
                    <th scope="col">Receitas</th>
                    <th scope="col">Transferêcias</th>
                  </tr>
                </thead>
                <tbody>

                  {clients.map(client => {
                    return (
                      <tr key={client.id}>
                        <td>{client.clients.name}</td>
                        <td>
                          { moment(client.createdAt).add(3, "hours").format('DD/MM/YYYY') }
                        </td>
                        <td>
                          <Button
                            color="info"
                            onClick={() => history.push(`/app/despesas`, {
                              clientCompanyId: client.clients.id
                            })}
                            size="sm"
                            className="mt-1"
                          >
                            Acessar
                            </Button></td>
                        <td>
                          <Button
                            color="info"
                            onClick={() => history.push(`/app/receitas`, {
                              clientCompanyId: client.clients.id
                            })}
                            size="sm"
                            className="mt-1"
                          >
                            Acessar
                          </Button></td>
                        <td>
                          <Button
                            color="info"
                            onClick={() => history.push(`/app/transferencias`, {
                              clientCompanyId: client.clients.id
                            })}
                            size="sm"
                            className="mt-1"
                          >
                            Acessar
                          </Button>
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
