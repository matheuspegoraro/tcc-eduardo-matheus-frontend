import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";

import HeaderWithDescription from "./../../components/Headers/HeaderWithDescription";
import api from '../../axios';
import { toast } from "react-toastify";

function Profile() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function loadProfile() {

      const { data } = await api.get('/profile', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setName(data.name);
      setEmail(data.email);
      setCreatedAt(data.createdAt);
      setCompanyName(data.company.name);

      switch (data.type) {
        case 1:
          setType('1 - ADMINISTRADOR');
          break;
        case 2:
          setType('2 - CONSULTOR');
          break;
        case 3:
          setType('3 - CLIENTE');
          break;
      }

    };

    loadProfile();
  }, []);

  async function handleUpdate() {

    setLoading(true);

    try {

      if (!name) {
        toast.warning("Preencha os campos obrigatórios!");
        return;
      }

      await api.put('/profile', { name }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toast.success("Perfil atualizado com sucesso!");

    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar o perfil!");
    } finally {
      setLoading(false)
    }

  }

  return (

    <>
      <HeaderWithDescription
        title="Perfil"
        description="Principais informações do usuário, e empresa."
        color="success"
      />

      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>

        <Breadcrumb>
          <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbItem active>Perfil</BreadcrumbItem>
        </Breadcrumb>

        <Row>
          <Col className="order-xl-1">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Informações Gerais </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {name ?
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      Usuário
                    </h6>
                    <div>
                      <Row>
                        <Col >
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Nome completo:
                            </label>
                            <Input
                              className="form-control"
                              defaultValue={name}
                              onChange={e => setName(e.target.value)}
                              placeholder="Ex: João da Silva"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col >
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              E-mail:
                            </label>
                            <Input
                              className="form-control"
                              defaultValue={email}
                              placeholder="email@email.com"
                              disabled={true}
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Tipo:
                            </label>
                            <Input
                              className="form-control"
                              defaultValue={type}
                              disabled={true}
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Ativo desde:
                            </label>
                            <Input
                              className="form-control"
                              defaultValue={createdAt ? moment(createdAt).add(3, 'hours').format('DD/MM/YYYY') : ''}
                              disabled={true}
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Empresa
                    </h6>
                    <div>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Nome:
                            </label>
                            <Input
                              className="form-control"
                              defaultValue={companyName}
                              disabled={true}
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                  : ''}
              </CardBody>
              <CardFooter>
                <Button color="success" type="submit" onClick={() => handleUpdate()} disabled={loading}>
                  {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                  Salvar
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
