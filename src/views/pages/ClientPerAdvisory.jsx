import React, { useEffect, useState } from "react";
import Moment from 'react-moment';

import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Table,
  CardFooter,
  Modal,
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';

function ClientPerAdvisory() {

  const [companies, setCompanies] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [modalLink, setModalLink] = useState(false);
  const [clientId, setClientId] = useState(0);
  const [advisoryId, setAdvisoryId] = useState(0);

  const [preSelectedAdvisories, setPreSelectedAdvisories] = useState([]);

  function toggleModal(id) {
    if(id === undefined) 
      setClientId(null);
    else  
      setClientId(id);

    setModalLink(!modalLink);
  };

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/clients', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setCompanies(response.data);
    }

    fetchData();

  }, []);

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/advisories', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setAdvisories(response.data);
    }

    fetchData();

  }, []);

  useEffect(() => {
    
    if (clientId > 0) handleLoadAdvisories(clientId);

  }, [clientId, loading]);

  const handleLoadAdvisories = async clientId => {
    const response = await api.get(`/relationship-company/${clientId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('api_token')}`
      }
    });

    setPreSelectedAdvisories(response.data.map(relationship => {
      return relationship;
    }));
  }

  const handleChange = e => {
    if (e.target.value !== '')
      setAdvisoryId(e.target.value);
    else
      setAdvisoryId(null);
  }

  const handleClick = async () => {

    const advisory = preSelectedAdvisories.filter(advisory => {
      return advisory.advisories.id === advisoryId;
    });

    if(advisory.length > 0) {
      toast.error('Relacionamento já existente!');
      return;
    }

    try {
      await api.post('/relationship-company', {
        clientId,
        advisoryId
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      handleLoadAdvisories(clientId);
      toast.success('Vínculo criado com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }
  };

  async function handleDelete(relationshipId) {

    setLoading(true);

    if(relationshipId) {
      try {
        await api.delete(`/relationship-company/${relationshipId}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('api_token')}`
          }
        });

        toast.success('Vínculo desfeito com sucesso!');
        setLoading(false);
      } catch (error) {
        toast.error('Ocorreu um erro na requisição!');
        setLoading(false);
      };      
    } else {
      toast.error('Ocorreu um erro na requisição!');
    }

  };

  return (
    <>
      <HeaderWithDescription
        title="Cliente X Consultoria"
        description="Permite a vinculação de consultorias e assessorias por clientes. Isso fará com que elas visualizem as informações pertinentes ao cliente."
        color="info"
      />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>
        <Modal
          className="modal-dialog-centered"
          isOpen={modalLink}
          toggle={() => toggleModal()}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="modalOfxLabel">
              {'Vincular Consultores a Esse Cliente'}
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => toggleModal()}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <label className="form-control-label" htmlFor="advisories">Consultorias:</label>
                  <Input
                    type="select"
                    className="form-control"
                    name="advisories"
                    id="advisories"
                    options={ advisories !== undefined ? advisories.map(advisory => {
                      return {
                          label: advisory.name,
                          value: advisory.id
                        }
                      }) : ''
                    }
                    onChange={handleChange}>
                    <option value=''>Nenhum</option>
                    { 
                      advisories !== undefined ? advisories.map(advisory =>
                        (<option key={advisory.id} value={advisory.id}>{advisory.name}</option>)  
                      ) : ''
                    }
                  </Input>
                </FormGroup>
              </Col>
              <Col sm={12}>
                <Button
                  color="success"
                  onClick={() => handleClick()}
                  className="mb-2 btn-block"
                >
                  Adicionar
                </Button>
              </Col>
              <hr/>
            </Row>
            <Row>
              <Col lg={12}>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nome Consultoria</th>
                      <th scope="col">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advisories !== undefined ? 
                      preSelectedAdvisories.map(advisory => {
                        return (
                          <tr key={advisory.advisories.id}>
                            <td>{advisory.advisories.name}</td>
                            <td>
                              <Button
                                color="danger"
                                onClick={() => handleDelete(advisory.id)}
                                size="sm"
                                className="ml-2 mt-1"
                              >
                                Remover
                              </Button>
                            </td>
                          </tr>
                        )
                      }) : ''
                    }
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
          <div className="modal-footer">
            <Button
              color="secondary"
              data-dismiss="modal"
              type="button"
              onClick={() => toggleModal()}
            >
              Fechar
            </Button>
          </div>
        </Modal>
        <Row>
          <Col>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="12">
                    <h3 className="mb-0">Lista de Clientes</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Cadastrada em</th>
                    <th scope="col">Vínculos</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(company => (
                    <tr key={company.id}>
                      <td>{company.name}</td>
                      <td>
                        <Moment format="DD/MM/YYYY">
                          {company.createdAt}
                        </Moment>
                      </td>
                      <td>
                        <Button
                          color="info"
                          onClick={() => toggleModal(company.id)}
                          size="sm"
                          className="mt-1"
                        >
                          Alterar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter>
                {/* <p className="h5">Encontramos {banksDefauts.length} banco(s) cadastrado(s).</p> */}
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ClientPerAdvisory;
