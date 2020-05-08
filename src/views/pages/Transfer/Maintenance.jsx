import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

import moment from "moment";
import CurrencyInput from 'react-currency-input';

import {
  Card,
  CardHeader,
  FormGroup,
  CardBody,
  Input,
  Container,
  Row,
  Col,
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
import { formatSaveMoney } from '../../../utils';

function Maintenance() {

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  //form inputs
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [bill, setBill] = useState('');
  const [billOut, setBillOut] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');

  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);

  //history
  const history = useHistory();

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/categories', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setCategories(response.data);
    }

    fetchData();

  }, []);

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

  }, []);


  function handleSubmit(e) {
    e.preventDefault()
    handleCreate();
  }

  async function handleCreate() {

    setLoading(true);

    try {
      await api.post('/movements/transfers', {
        categoryId: category,
        billId: bill,
        billOutId: billOut,
        name: description,
        value: formatSaveMoney(value),
        date,
        dischargeDate: date
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toast.success('A movimentação foi realizada com sucesso!');
      history.push('/app/transferencias')

    } catch (e) {
      if (e.response) {
        const { error } = e.response.data;
        toast.error(error);
      }
    } finally {
      setLoading(false);
    };

  };

  return (
    <>
      <HeaderWithDescription
        title="Transferências"
        description="Permite a transferências de qualquer valor entre contas de bancárias internas diferentes."
        color="primary"
      />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>

        <div>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to="/app/transferencias">Receitas</Link></BreadcrumbItem>
            <BreadcrumbItem active>Transferências</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <Alert color="warning" hidden={!notFound}>
          Não encontramos o que você procurava. <br></br>
          Por favor, tente novamente mais tarde!
        </Alert>

        <Row hidden={notFound}>
          <Col>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Transferências - Novo</h3>
                  </Col>
                </Row>
              </CardHeader>
              <Form onSubmit={handleSubmit}>
                <CardBody>
                  <h6 className="heading-small text-muted mb-4">Informações Gerais</h6>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="name-bank">Descrição:</label>
                    <Input
                      required
                      id="description"
                      type="text"
                      value={description}
                      placeholder="Ex: Pagamento de energia elétrica."
                      onChange={e => setDescription(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="category">Categoria:</label>
                    <Input
                      required
                      type="select"
                      name="category"
                      id="category"
                      onChange={e => {
                        if (e.target.value !== '')
                          setCategory(e.target.value);
                      }}>
                      <option value="">Selecione uma categoria...</option>
                      {categories !== undefined ? categories.map(category => {
                        return <option value={category.id} key={category.id}>{category.name}</option>
                      }) : ''}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="bill-type-id">Conta Bancária (Saída):</label>
                    <Input
                      required
                      type="select"
                      name="billOut"
                      id="billOut"
                      onChange={e => {
                        if (e.target.value !== '')
                          setBillOut(e.target.value);
                      }}>
                      <option value="">Selecione uma conta bancária...</option>
                      {bills !== undefined ? bills.map(bill => {
                        return <option value={bill.id} key={bill.id}>{bill.name}</option>
                      }) : ''}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="bill-type-id">Conta Bancária (Entrada):</label>
                    <Input
                      required
                      type="select"
                      name="bill"
                      id="bill"
                      onChange={e => {
                        if (e.target.value !== '')
                          setBill(e.target.value);
                      }}>
                      <option value="">Selecione uma conta bancária...</option>
                      {bills !== undefined ? bills.map(bill => {
                        return <option value={bill.id} key={bill.id}>{bill.name}</option>
                      }) : ''}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="value">Valor:</label>
                    <Input
                      required
                      id="value"
                      placeholder="Ex: R$ 200,00"
                      decimalSeparator=","
                      thousandSeparator="."
                      precision="2"
                      tag={CurrencyInput}
                      type="text"
                      value={value}
                      onChangeEvent={e => setValue(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="name-bank">Transferido em:</label>
                    <Input
                      required
                      type="date"
                      name="date"
                      id="date"
                      value={moment(date).format('YYYY-MM-DD')}
                      onChange={e => setDate(e.target.value)}
                    />
                  </FormGroup>
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