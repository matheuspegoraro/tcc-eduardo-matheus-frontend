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
import { getAllDays, formatSaveMoney, formatShowMoney } from '../../utils';

function Bills() {

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const [banks, setBanks] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  
  //form inputs
  const [modalBill, setModalBill] = useState(false);
  const [bankId, setBankId] = useState('');
  const [billTypeId, setBillTypeId] = useState('');
  const [name, setName] = useState('');
  const [currentValue, setCurrentValue] = useState(0);

  const [editIdBill, setEditIdBill] = useState(null);

  function toggleModal() {
    setEditIdBill(null);
    setBankId('');
    
    if(billTypes[0]) 
      setBillTypeId(billTypes[0].id);

    setName('');
    setCurrentValue(0);

    setModalBill(!modalBill);
  };

  function toggleEditModal(id) {

    const billEditable = bills.filter(bill => {
      return bill.id === id;
    });
    
    setEditIdBill(billEditable[0].id);
    setBankId(billEditable[0].bank.id);
    setBillTypeId(billEditable[0].billType.id);
    setName(billEditable[0].name);
    setCurrentValue(billEditable[0].currentValue);
    
    setModalBill(!modalBill);

  };

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/bills', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setBills(response.data);
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

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/bill-types', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setBillTypes(response.data);
    }

    fetchData();

  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (editIdBill) {
      handleEdit();
    } else {
      handleCreate();
    }
  };

  async function handleCreate() {

    setLoading(true);

    try {
      await api.post('/bills', {
        bankId,
        billTypeId,
        name,
        currentValue: formatSaveMoney(currentValue)
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Conta criada com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }
  };

  async function handleEdit() {

    setLoading(true);

    try {
      await api.put(`/bills/${editIdBill}`, {
        bankId,
        billTypeId,
        name,
        currentValue: formatSaveMoney(currentValue)
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Conta alterada com sucesso!');
      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }

  };

  async function handleDelete(id) {

    setLoading(true);

    const bill = bills.filter(bill => {
      return bill.id !== id;
    });

    if(bill) {
      try {
        await api.delete(`/bills/${id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('api_token')}`
          }
        });
      } catch (error) {
        setLoading(false);
      };
  
      toast.success('A conta foi removida com sucesso!');
      setLoading(false);
    } else {
      toast.error('Ocorreu um erro na requisição!');
    }

  };

  return (
    <>
      <HeaderWithDescription
        title="Contas Bancárias"
        description="Permite a manutenção de suas contas bancárias. Ao utilizar o controle de despesas e receitas, quando uma movimentação tiver selecionado a conta bancária em que houve, automaticamente atualizará o saldo de suas contas."
        color="info"
      />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Modal
          className="modal-dialog-centered"
          isOpen={modalBill}
          toggle={() => toggleModal()}
        >
          <Form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                {!editIdBill ? 'Adição de Contas': `Alterar Conta - ${name}`}
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
                <label className="form-control-label" htmlFor="bill-type-id">Tipo de Conta:</label>
                <Input
                  type="select"
                  className="form-control-alternative"
                  name="bill-type-id"
                  id="bill-type-id"
                  defaultValue={billTypeId}
                  onChange={e => {
                    if (e.target.value !== '')
                      setBillTypeId(e.target.value);
                  }}>
                  {billTypes !== undefined ? billTypes.map(billType => {
                    return <option value={billType.id} key={billType.id}>{billType.name}</option>
                  }) : ''}
                </Input>
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="bill-name">Nome da Conta:</label>
                <Input
                  className="form-control-alternative"
                  id="bill-name"
                  placeholder="Ex: Cartão Platinum..."
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="current-value">Valor Corrente/Inicial:</label>
                <InputGroup className="form-control-alternative">
                  <InputGroupAddon addonType="prepend">R$</InputGroupAddon>
                  <Input
                    type="text"
                    decimalSeparator=","
                    thousandSeparator="."
                    precision="2"
                    tag={CurrencyInput}
                    id="current-value"
                    value={currentValue}
                    onChangeEvent={e => setCurrentValue(e.target.value)}
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
                {!editIdBill ? 'Criar!': 'Editar!'}
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
                    <h3 className="mb-0">Contas Bancárias</h3>
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
                    <th scope="col">Valor Corrente</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id}>
                      <td>
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={bill.bank.imgPath}
                            />
                          </a>
                        </Media>
                      </td>
                      <td>{bill.name}</td>
                      <td>R$ {formatShowMoney(bill.currentValue)}</td>
                      <td>
                        <Moment format="DD/MM/YYYY HH:mm">
                          {bill.createdAt}
                        </Moment>
                      </td>
                      <td>
                        <Button
                          color="info"
                          onClick={() => toggleEditModal(bill.id)}
                          size="sm"
                          className="mt-1"
                        >
                          Alterar
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => handleDelete(bill.id)}
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

export default Bills;
