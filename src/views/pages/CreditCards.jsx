import React, { useEffect, useState } from "react";
import Moment from 'react-moment';
import CurrencyInput from 'react-currency-input';

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

function Cards() {

  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [banks, setBanks] = useState([]);
  
  //form inputs
  const [modalCreditCard, setModalCreditCard] = useState(false);
  const [bankId, setBankId] = useState('');
  const [name, setName] = useState('');
  const [closingDay, setClosingDay] = useState(1);
  const [deadlineDay, setDeadlineDay] = useState(1);
  const [limit, setLimit] = useState(0);

  const [editIdCreditCard, setEditIdCreditCard] = useState(null);

  function toggleModal() {
    setEditIdCreditCard(null);
    setBankId('');
    setName('');
    setClosingDay(1);
    setDeadlineDay(1);
    setLimit(0);

    setModalCreditCard(!modalCreditCard);
  };

  function toggleEditModal(id) {

    const creditCardEditable = creditCards.filter(creditCard => {
      return creditCard.id === id;
    });
    
    setEditIdCreditCard(creditCardEditable[0].id);
    setBankId(creditCardEditable[0].bank.id);
    setName(creditCardEditable[0].name);
    setClosingDay(creditCardEditable[0].closingDay);
    setDeadlineDay(creditCardEditable[0].deadlineDay);
    setLimit(formatShowMoney(creditCardEditable[0].limit));
    
    setModalCreditCard(!modalCreditCard);

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

  }, [loading]);

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

    if (editIdCreditCard) {
      handleEdit();
    } else {
      handleCreate();
    }
  };

  async function handleCreate() {

    setLoading(true);

    try {
      await api.post('/credit-cards', {
        bankId,
        name,
        closingDay,
        deadlineDay,
        limit: formatSaveMoney(limit)
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Cartão criado com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }
  };

  async function handleEdit() {

    setLoading(true);

    try {
      await api.put(`/credit-cards/${editIdCreditCard}`, {
        bankId,
        name,
        closingDay,
        deadlineDay,
        limit: formatSaveMoney(limit)
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Cartão alterado com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }
  };

  async function handleDeleteBank(id) {

    setLoading(true);

    creditCards.filter(creditCard => {
      return creditCard.id !== id;
    });

    try {
      await api.delete(`/credit-cards/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });
    } catch (error) {
      setLoading(false);
    };

    toast.success('O cartão foi removido com sucesso!');
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
      <Container className="mt-3 mb-4" fluid>
        <Modal
          className="modal-dialog-centered"
          isOpen={modalCreditCard}
          toggle={() => toggleModal()}
        >
          <Form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                {!editIdCreditCard ? 'Adição de Cartões': `Editar Cartão - ${name}`}
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
                  type="select"
                  className="form-control-alternative"
                  id="closing-day"
                  defaultValue={closingDay}
                  onChange={e => setClosingDay(e.target.value)}>
                    {getAllDays().map(day => {
                      return <option value={day} key={day}>{day}</option>
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="name-bank">Dia de vencimento:</label>
                <Input
                  type="select"
                  className="form-control-alternative"
                  id="deadline-day"
                  defaultValue={deadlineDay}
                  onChange={e => setDeadlineDay(e.target.value)}>
                    {getAllDays().map(day => {
                      return <option value={day} key={day}>{day}</option>
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="name-bank">Limite de Crédito:</label>
                <InputGroup className="form-control-alternative">
                  <InputGroupAddon addonType="prepend">R$</InputGroupAddon>
                  <Input
                    type="text"
                    decimalSeparator=","
                    thousandSeparator="."
                    precision="2"
                    tag={CurrencyInput}
                    id="limit"
                    value={limit}
                    onChangeEvent={e => setLimit(e.target.value)}
                  />
                </InputGroup>
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
              <Button className="my-4" color="success" type="submit" disabled={loading}>
                {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                {!editIdCreditCard ? 'Criar!': 'Editar!'}
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
                    <h3 className="mb-0">Cartões de Crédito</h3>
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
                  {creditCards.map(creditCard => (
                    <tr key={creditCard.id}>
                      <td>
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={creditCard.bank.imgPath}
                            />
                          </a>
                        </Media>
                      </td>
                      <td>{creditCard.name}</td>
                      <td>{creditCard.closingDay}</td>
                      <td>{creditCard.deadlineDay}</td>
                      <td>
                        <Moment format="DD/MM/YYYY">
                          {creditCard.createdAt}
                        </Moment>
                      </td>
                      <td>
                        <Button
                          color="info"
                          onClick={() => toggleEditModal(creditCard.id)}
                          size="sm"
                          className="mt-1"
                        >
                          Alterar
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => handleDeleteBank(creditCard.id)}
                          size="sm"
                          className="ml-2 mt-1"
                        >
                          Remover
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

export default Cards;
