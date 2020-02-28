import React, { useEffect, useState } from "react";
import Moment from 'react-moment';
import InputMask from 'react-input-mask';

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

function Cards() {

  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalCreateCreditCard, setModalCreateCreditCard] = useState(false);

  //form inputs
  const [banks, setBanks] = useState([]);
  const [bankId, setBankId] = useState('');
  const [name, setName] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [deadlineDay, setDeadlineDay] = useState('');
  const [limit, setLimit] = useState(0);

  function toggleModal() {
    setBankId('');
    setName('');
    setClosingDay('');
    setDeadlineDay('');
    setLimit(0);

    setModalCreateCreditCard(!modalCreateCreditCard);
  };

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/credit-cards', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setCreditCards(response.data);
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

  async function handleSubmit(e) {
    e.preventDefault();

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
  };

  function handleEditBank(id) {

    toggleModal('modalCreateCreditCard');

    const bankEditable = banks.filter(bank => {
      return bank.id === id;
    });

    setName(bankEditable[0].name);

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
        title="Cartões"
        description="Permite a manutenção dos cartões de créditos. Utilizá-los fará com que você possua uma simulação de sua fatura do cartão de crédito, simulação de seu saldo disponível e muito mais!"
        color="info"
      />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Modal
          className="modal-dialog-centered"
          isOpen={modalCreateCreditCard}
          toggle={() => toggleModal("modalCreateCreditCard")}
        >
          <Form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                Adição de Bancos
            </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleModal("modalCreateCreditCard")}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <FormGroup>
                <label className="form-control-label" htmlFor="bank-id">Banco:</label>
                <Input
                  type="select"
                  className="form-control-alternative"
                  name="bank-id"
                  id="bank-id"
                  defaultValue={bankId}
                  onChange={e => {
                    if (e.target.value !== '')
                      setBankId(e.target.value);
                    else
                      setBankId('');
                  }}>
                  <option value=''>Nenhum</option>
                  {banks !== undefined ? banks.map(bank => {
                    return <option value={bank.id} key={bank.id}>{bank.name}</option>
                  }) : ''}
                </Input>
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="name-bank">Nome do Cartão:</label>
                <Input
                  className="form-control-alternative"
                  id="card-name"
                  placeholder="Ex: Cartão Platinum..."
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="name-bank">Dia de fechamento:</label>
                <Input
                  className="form-control-alternative"
                  id="closing-day"
                  type="number"
                  value={closingDay}
                  onChange={e => setClosingDay(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="name-bank">Dia de vencimento:</label>
                <Input
                  className="form-control-alternative"
                  id="deadline-day"
                  type="number"
                  value={deadlineDay}
                  onChange={e => setDeadlineDay(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="name-bank">Limite de Crédito:</label>
                <InputGroup className="form-control-alternative">
                  <InputGroupAddon addonType="prepend">R$</InputGroupAddon>
                  <Input
                    type="tel"
                    mask="99999,99"
                    maskPlaceholder="0"
                    tag={InputMask}
                    id="limit"
                    type="text"
                    value={limit}
                    onChange={e => setLimit(e.target.value)}
                  />
                </InputGroup>
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
                Criar!
                </Button>
            </div>
          </Form>
        </Modal>

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
                    <th scope="col">Banco</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Fechamento em</th>
                    <th scope="col">Vencimento em</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map(bank => (
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
                        <div
                          className="fas fa-user-edit mr-3"
                          id="editarBtn"
                          style={{ color: '#5e72e4', cursor: 'pointer' }}
                          onClick={() => handleEditBank(bank.id)}
                        >
                        </div>
                        <div
                          className="fas fa-trash"
                          id="excluirBtn"
                          style={{ color: '#f5365c', cursor: 'pointer' }}
                          onClick={() => handleDeleteBank(bank.id)}
                        >
                        </div>
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

export default Cards;
