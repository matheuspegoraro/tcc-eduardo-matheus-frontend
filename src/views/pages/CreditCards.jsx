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
import { months } from "moment";

function Cards() {

  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [banks, setBanks] = useState([]);
  
  //form create inputs
  const [modalCreateCreditCard, setModalCreateCreditCard] = useState(false);
  const [bankId, setBankId] = useState('');
  const [name, setName] = useState('');
  const [closingDay, setClosingDay] = useState(1);
  const [deadlineDay, setDeadlineDay] = useState(1);
  const [limit, setLimit] = useState(0);
  
  //form edit inputs
  const [modalEditCreditCard, setModalEditCreditCard] = useState(false);
  const [editIdCreditCard, setEditIdCreditCard] = useState(0);
  const [editBankId, setEditBankId] = useState('');
  const [editName, setEditName] = useState('');
  const [editClosingDay, setEditClosingDay] = useState(1);
  const [editDeadlineDay, setEditDeadlineDay] = useState(1);
  const [editLimit, setEditLimit] = useState(0);

  function toggleModal() {
    setBankId('');
    setName('');
    setClosingDay(1);
    setDeadlineDay(1);
    setLimit(0);

    setModalCreateCreditCard(!modalCreateCreditCard);
  };

  function toggleEditModal() {
    setEditBankId('');
    setEditName('');
    setEditClosingDay(1);
    setEditDeadlineDay(1);
    setEditLimit(0);

    setModalEditCreditCard(!modalEditCreditCard);
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

  async function handleEditSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      await api.put(`/credit-cards/${editIdCreditCard}`, {
        bankId: editBankId,
        name: editName,
        closingDay: editClosingDay,
        deadlineDay: editDeadlineDay,
        limit: formatSaveMoney(editLimit)
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleEditModal();
      toast.success('Cartão alterado com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }
  };

  function handleEditCreditCard(id) {

    const creditCardEditable = creditCards.filter(creditCard => {
      return creditCard.id === id;
    });
    
    setEditIdCreditCard(creditCardEditable[0].id);
    setEditBankId(creditCardEditable[0].bank.id);
    setEditName(creditCardEditable[0].name);
    setEditClosingDay(creditCardEditable[0].closingDay);
    setEditDeadlineDay(creditCardEditable[0].deadlineDay);
    setEditLimit(formatShowMoney(creditCardEditable[0].limit));
    
    setModalEditCreditCard(!modalEditCreditCard);

  };

  async function handleDeleteBank(id) {

    setLoading(true);

    const creditCard = creditCards.filter(creditCard => {
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

  function getAllDays() {
    let days = [];

    for (let i = 1; i <= 31; i++) {
      days[i] = i;
    }

    return days;
  }

  function formatSaveMoney(tempMoney) {
    tempMoney = tempMoney.split(".");
    tempMoney = tempMoney.join("");
    tempMoney = tempMoney.split(",");
    tempMoney = tempMoney.join(".");

    return tempMoney;
  }

  function formatShowMoney(tempMoney) {
    if (!tempMoney)
      tempMoney = 0;

    return tempMoney.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

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
          toggle={() => toggleModal()}
        >
          <Form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                Adição de Cartões
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
                Criar!
                </Button>
            </div>
          </Form>
        </Modal>

        <Modal
          className="modal-dialog-centered"
          isOpen={modalEditCreditCard}
          toggle={() => toggleEditModal()}
        >
          <Form onSubmit={handleEditSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                Adição de Cartões
            </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleEditModal()}
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
                  defaultValue={editBankId}
                  onChange={e => {
                    if (e.target.value !== '')
                      setEditBankId(e.target.value);
                    else
                      setEditBankId('');
                  }}>
                  <option value=''>Nenhum</option>
                  {banks !== undefined ? banks.map(bank => {
                    return <option value={bank.id} key={bank.id}>{bank.name}</option>
                  }) : ''}
                </Input>
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="card-bank">Nome do Cartão:</label>
                <Input
                  className="form-control-alternative"
                  id="card-name"
                  placeholder="Ex: Cartão Platinum..."
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="closing-day">Dia de fechamento:</label>
                <Input
                  type="select"
                  className="form-control-alternative"
                  id="closing-day"
                  defaultValue={editClosingDay}
                  onChange={e => setEditClosingDay(e.target.value)}>
                    {getAllDays().map(day => {
                      return <option value={day} key={day}>{day}</option>
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="deadline-day">Dia de vencimento:</label>
                <Input
                  type="select"
                  className="form-control-alternative"
                  id="deadline-day"
                  defaultValue={editDeadlineDay}
                  onChange={e => setEditDeadlineDay(e.target.value)}>
                    {getAllDays().map(day => {
                      return <option value={day} key={day}>{day}</option>
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="limit">Limite de Crédito:</label>
                <InputGroup className="form-control-alternative">
                  <InputGroupAddon addonType="prepend">R$</InputGroupAddon>
                  <Input
                    type="text"
                    decimalSeparator=","
                    thousandSeparator="."
                    precision="2"
                    tag={CurrencyInput}
                    id="editLimit"
                    value={editLimit}
                    onChangeEvent={e => setEditLimit(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </div>
            <div className="modal-footer">
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleEditModal()}
              >
                Fechar
                </Button>
              <Button className="my-4" color="success" type="submit" disabled={loading}>
                {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                Editar!
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
                        <Moment format="DD/MM/YYYY HH:mm">
                          {creditCard.createdAt}
                        </Moment>
                      </td>
                      <td>
                        <div
                          className="fas fa-user-edit mr-3"
                          id="editarBtn"
                          style={{ color: '#5e72e4', cursor: 'pointer' }}
                          onClick={() => handleEditCreditCard(creditCard.id)}
                        >
                        </div>
                        <div
                          className="fas fa-trash"
                          id="excluirBtn"
                          style={{ color: '#f5365c', cursor: 'pointer' }}
                          onClick={() => handleDeleteBank(creditCard.id)}
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
