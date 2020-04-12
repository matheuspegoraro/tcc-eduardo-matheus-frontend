import React, { useEffect, useState } from "react";
import Moment from 'react-moment';
import CurrencyInput from 'react-currency-input';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  Button,
  Card,
  CardHeader,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  CardFooter,
  Modal,
  Media,
  InputGroup,
  InputGroupAddon
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';

import { getAllDays, formatSaveMoney, formatShowMoney } from '../../utils';

function ClientPerAdvisory() {

  const [companies, setCompanies] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [modalLink, setModalLink] = useState(false);
  const [clientId, setClientId] = useState(0);
  const [advisoryId, setAdvisoryId] = useState(0);

  const [selectedClients, setSelectedClients] = useState([]);
  const [preSelectedClients, setPreSelectedClients] = useState([]);

  const animatedComponents = makeAnimated();

  function toggleModal(id) {
    setAdvisoryId(id);

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

    async function fetchData(advisoryId) {
      const response = await api.get(`/relationship-company/${advisoryId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      console.log(response.data);

      setPreSelectedClients(response.data.map(client => {
        return client.clientId
      }));
    }

    if (advisoryId > 0) fetchData(advisoryId);

  }, [advisoryId]);

  const handleChange = selectedOptions => {
    let tempOptions = [];

    selectedOptions.map(option => {
      tempOptions.push(option.value);
    });
    
    setSelectedClients(tempOptions);
  }

  const handleClick = async () => {
    try {
      await api.post('/relationship-company', {
        advisoryId,
        selectedClients
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Vínculo criado com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
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
            <FormGroup>
              <label className="form-control-label" htmlFor="advisories">Consultorias:</label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                name="advisories"
                id="advisories"
                defaultValue={
                  advisories.map(advisory => {
                    if(preSelectedClients.includes(advisory.id)) {
                      return {
                        label: advisory.name,
                        value: advisory.id
                      }
                    }
                  })
                }
                isMulti
                options={ advisories !== undefined ? advisories.map(advisory => {
                  return {
                      label: advisory.name,
                      value: advisory.id
                    }
                  }) : ''
                }
                onChange={handleChange}
              />
            </FormGroup>
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
            <Button className="my-4" color="success" type="button" disabled={loading} onClick={handleClick}>
              {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
              {'Vincular!'}
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
