import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

import {
  Card,
  CardHeader,
  FormGroup,
  CardBody,
  Input,
  Container,
  Row,
  Col,
  Media,
  Label,
  FormText,
  Alert,
  BreadcrumbItem,
  Breadcrumb,
  Button,
  CardFooter,
  Form
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../../axios';
import { toast } from 'react-toastify';
import noimage from './../../../assets/img/brand/noimage.png';

function Maintenance(props) {

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  //form inputs
  const [icon, setIcon] = useState(null);
  const [iconPreview, seticonPreview] = useState(null);
  const [name, setName] = useState('');

  //history
  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {

    if (id) {
      async function fetchData() {
        try {
          const { data } = await api.get(`/banks/${id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('api_token')}`
            }
          });
          setName(data.name);
        } catch (error) {
          setNotFound(true);
        }
      }

      fetchData();
    }

  }, []);


  function handleSubmit(e) {
    e.preventDefault()

    if (id)
      handleEdit();
    else
      handleCreate();

  }

  async function handleCreate() {

    /*let data = new FormData();
    data.append('name', name);
    data.append('imgPath', iconPreview);*/

    setLoading(true);

    try {
      const response = await api.post('/banks', {
        name
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toast.success('Banco criado com sucesso!');
      history.push('/app/bancos');

    } catch (error) {
      toast.error('Ocorreu um erro na requisição!');
    } finally {
      setLoading(false);
    }

  }

  async function handleEdit() {
    setLoading(true);

    try {
      const newBank = await api.put(`/banks/${id}`, {
        name
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toast.success('Banco alterado com sucesso!');
      history.push('/app/bancos');

    } catch (error) {
      toast.error('Ocorreu um erro na requisição!');
    } finally {
      setLoading(false);
    }
  }

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
            <BreadcrumbItem><Link to="/app/bancos">Bancos</Link></BreadcrumbItem>
            <BreadcrumbItem active>Manutenção</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <Alert color="warning" hidden={!notFound}>
          Não encontramos o banco! <br></br>
          Por favor, tente novamente mais tarde!
        </Alert>

        <Row hidden={notFound}>
          <Col>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Bancos - Manutenção</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Form onSubmit={handleSubmit}>
                <CardBody>
                  <h6 className="heading-small text-muted mb-4">Informações Gerais</h6>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="name">Nome:</label>
                    <Input
                      className="form-control"
                      id="name"
                      placeholder="Ex: Banco do Brasil..."
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </FormGroup>
                  <h6 className="heading-small text-muted mb-4">Ícones</h6>
                  <FormGroup>
                    <Label for="exampleFile">Imagem:</Label>
                    <Input type="file" name="file" id="exampleFile" />
                    <FormText color="muted">
                      Escolha um imagem para representar o banco, o ícone aparecerá nas principais telas de pesquisa.
                  </FormText>
                  </FormGroup>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup style={{ marginRight: 20 }}>
                      <label className="form-control-label" htmlFor="imagemAtual">Atual:</label>
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          onClick={e => e.preventDefault()}
                        >
                          <img
                            id="imagemAtual"
                            alt="imagem"
                            src={icon ? icon : noimage}
                          />
                        </a>
                      </Media>
                    </FormGroup>
                    <FormGroup>
                      <label className="form-control-label" htmlFor="imagemAtual">Prévia:</label>
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          onClick={e => e.preventDefault()}
                        >
                          <img
                            id="imagemAtual"
                            alt="imagem"
                            src={iconPreview ? URL.createObjectURL(iconPreview) : noimage}
                          />
                        </a>
                      </Media>
                    </FormGroup>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button color="success" type="submit" disabled={loading}>
                    {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                  Salvar
                </Button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>

      </Container >
    </>
  );
}
export default Maintenance;