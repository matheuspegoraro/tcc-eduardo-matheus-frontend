import React, { useEffect, useState } from "react";
import Moment from 'react-moment';

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
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';

function Banks() {

  //bancos padrões
  const [banksDefauts, setBanksDefauts] = useState([]);

  //bancos do usuario
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalBank, setModalBank] = useState(false);
  const [displayInput, setDisplayInput] = useState('Aguardando arquivo...');

  //form inputs
  const [iconFile, setIconFile] = useState(null);
  const [name, setName] = useState('');
  const [bankId, setBankId] = useState(null);

  function toggleModal() {
    setBankId(null);
    setName('');
    setModalBank(!modalBank);
  };

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

  }, []);

  async function handleCreate() {

    /*let data = new FormData();

    data.append('name', name);
    data.append('imgPath', iconFile); */

    setLoading(true);

    try {
      const response = await api.post('/banks', {
        name,
        imgPath: null
      }, {
        headers: {
          //'Content-Type': 'multpart/form-data',
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setBanks([...banks, response.data]);

      toast.success('Banco criado com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }

  }
  async function handleEdit() {
    setLoading(true);

    try {
      await api.put(`/banks/${bankId}`, {
        name
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Banco alterado com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (bankId)
      handleEdit();
    else
      handleCreate();

  };

  function toogleModalEditBank(id) {

    toggleModal('modalBank');

    const bankEditable = banks.filter(bank => {
      return bank.id === id;
    });

    setName(bankEditable[0].name);
    setBankId(id);

  };

  async function handleDeleteBank(id) {

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
      setLoading(false);
    };

    setBanks(newBanks);
    toast.success('O banco foi removido com sucesso!');
    setLoading(false);
  };

  return (
    <>
      <HeaderWithDescription
        title="Bancos"
        description="Permite a manutenção dos bancos, o sistema já disponibiliza uma grande quantidade de bancos pré-cadastrado, mas nada te impede de criar novos!"
        color="info"
      />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Modal
          className="modal-dialog-centered"
          isOpen={modalBank}
          toggle={() => toggleModal("modalBank")}
        >
          <Form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                {bankId ? 'Edição de Bancos' : 'Adição de Bancos'}
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleModal("modalBank")}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <FormGroup>
                <label className="form-control-label" htmlFor="name-bank">Nome:</label>
                <Input
                  className="form-control-alternative"
                  id="name-bank"
                  placeholder="Ex: Banco do Brasil..."
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="iconFile">Icone:</label>
                <div className="custom-file">
                  <input
                    className="custom-file-input"
                    id="iconFile"
                    type="file"
                    onChange={
                      (e) => {
                        setIconFile(e.target.files[0]);
                        setDisplayInput(e.target.files[0].name);
                      }
                    }
                  />
                  <label className="custom-file-label" htmlFor="iconFile">
                    {displayInput.length > 40 ? displayInput.substring(0, 35) + '...' : displayInput}
                  </label>
                </div>
              </FormGroup>
            </div>
            <div className="modal-footer">
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleModal("modalOfx")}
              >
                Fechar
                </Button>
              <Button className="my-4" color="success" type="submit" disabled={loading}>
                {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                {bankId ? 'Editar!' : 'Criar!'}
              </Button>
            </div>
          </Form>
        </Modal>

        <Row>
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
                              src={bank.imgPath}
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

        <Row className="mt-5">
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
                      onClick={() => toggleModal("modalOfx")}
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
                                  src={bank.imgPath}
                                />
                              </a>
                            </Media>
                          </td>
                          <td>{bank.name}</td>
                          <td>
                            <Moment format="DD/MM/YYYY HH:mm">
                              {bank.createdAt}
                            </Moment>
                          </td>
                          <td>
                            <Button
                              color="danger"
                              onClick={() => handleDeleteBank(bank.id)}
                              size="sm"
                              className="float-right ml-2 mt-1"
                            >
                              Remover
                            </Button>
                            <Button
                              color="info"
                              onClick={() => toogleModalEditBank(bank.id)}
                              size="sm"
                              className="float-right mt-1"
                            >
                              Alterar
                            </Button>
                          </td>
                        </tr>
                      )
                    }
                  })}
                </tbody>
              </Table>
              <CardFooter>
                <p className="h5">Encontramos {banks.filter( bank => ( bank.companyId !== null )).length} banco(s) cadastrado(s).</p>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Banks;
