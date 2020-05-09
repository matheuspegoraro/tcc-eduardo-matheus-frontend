import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import Moment from 'react-moment';

import {
  Button,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Table,
  CardFooter,
  Media,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../../axios';
import { toast } from 'react-toastify';
import noimage from './../../../assets/img/brand/noimage.png';

function Banks() {

  const history = useHistory();

  //bancos padrões
  const [banksDefauts, setBanksDefauts] = useState([]);

  //bancos do usuario
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/banks-default', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setBanksDefauts(response.data);
    }

    fetchData();

  }, []);

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/banks', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setBanks(response.data);
    }

    fetchData();

  }, [loading]);

  async function handleDelete(id) {

    setLoading(true);

    const newBanks = banks.filter(bank => {
      return bank.id !== id;
    });

    try {
      await api.delete(`/banks/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });
    } catch (error) {
      toast.error('Ocorreu um erro na requisição!');
    } finally {
      setLoading(false);
    };

    setBanks(newBanks);
    toast.success('O banco foi removido com sucesso!');
  };

  return (
    <>
      <HeaderWithDescription
        title="Bancos"
        description="Permite a manutenção dos bancos, o sistema já disponibiliza uma grande quantidade de bancos pré-cadastrado, mas nada te impede de criar novos!"
        color="info"
      />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>

        <div>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
            <BreadcrumbItem active>Bancos</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <Row>
          <Col>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Bancos Cadastrados</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="success"
                      onClick={() => history.push(`/app/bancos/novo`)}
                      size="sm"
                    >
                      Novo
                      </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Icone</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map(bank => {
                    if (bank.companyId !== null) {
                      return (
                        <tr key={bank.id}>
                          <td>
                            <Media className="align-items-center">
                              <a
                                className="avatar rounded-circle mr-3"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                <img
                                  alt="..."
                                  src={bank.imgPath ? bank.imgPath : noimage}
                                />
                              </a>
                            </Media>
                          </td>
                          <td>{bank.name}</td>
                          <td>
                            <Moment format="DD/MM/YYYY">
                              {bank.createdAt}
                            </Moment>
                          </td>
                          <td>
                            <Button
                              color="info"
                              onClick={() => history.push(`/app/bancos/${bank.id}/editar`)}
                              size="sm"
                              className="mt-1"
                            >
                              Alterar
                            </Button>
                            <Button
                              color="danger"
                              onClick={() => handleDelete(bank.id)}
                              size="sm"
                              className="ml-2 mt-1"
                            >
                              Remover
                            </Button>
                          </td>
                        </tr>
                      )
                    }
                  })}
                </tbody>
              </Table>
              <CardFooter>
                <p className="h5">Encontramos {banks.filter(bank => (bank.companyId !== null)).length} banco(s) cadastrado(s).</p>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Bancos Padrões</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Icone</th>
                    <th scope="col">Nome</th>
                  </tr>
                </thead>
                <tbody>
                  {banksDefauts.map(bank => (
                    <tr key={bank.id}>
                      <td>
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={bank.imgPath ? bank.imgPath : noimage}
                            />
                          </a>
                        </Media>
                      </td>
                      <td>{bank.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter>
                <p className="h5">Encontramos {banksDefauts.length} banco(s) padrão(ões).</p>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container >
    </>
  );
}
export default Banks;