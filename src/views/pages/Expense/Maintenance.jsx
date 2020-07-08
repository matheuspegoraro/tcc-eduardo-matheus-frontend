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
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [done, setDone] = useState(false);
  const [dischargeDate, setDischargeDate] = useState(null);

  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);

  //history
  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {

    if (id) {
      async function fetchData() {
        try {
          const { data } = await api.get(`/movements/expenses/${id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('api_token')}`
            }
          });

          if (!data) {
            setNotFound(true);
            return;
          }

          setDescription(data.name);
          setCategory(data.categoryId);
          setBill(data.billId);
          setValue(data.value);
          setDate(data.date);
          setDone(data.done);


        } catch (error) {
          setNotFound(true);
        }
      }

      fetchData();
    }

  }, []);

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

    if (id)
      handleEdit();
    else
      handleCreate();

  }

  async function handleCreate() {

    setLoading(true);

    try {
      await api.post('/movements/expenses', {
        billId: bill,
        movementTypeId: 1,
        categoryId: category,
        name: description,
        done,
        dischargeDate,
        value: formatSaveMoney(value),
        date
    }, {
        headers: {
            authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
    });

      toast.success('A movimentação foi adicionada com sucesso!');
      history.push('/app/despesas');

    } catch (e) {
      if (e.response) {
        const { error } = e.response.data;
        toast.error(error);
      }
    } finally {
      setLoading(false);
    };

  }

  async function handleEdit() {
    setLoading(true);

    try {
      await api.put(`/movements/expenses/${id}`, {
        billId: bill,
        movementTypeId: 1,
        categoryId: category,
        name: description,
        value: formatSaveMoney(value),
        date
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toast.success('A movimentação foi alterada com sucesso!');
      history.push('/app/despesas');

    } catch (e) {
      if (e.response) {
        const { error } = e.response.data;
        toast.error(error);
      }
    } finally {
      setLoading(false);
    };
  }

  return (
    <>
      <HeaderWithDescription
        title="Despesas"
        description="Permite o gerencimento de suas contas à pagar, você pode controlar a saída de valores na empresa e conferir pagamentos pendentes."
        color="danger"
      />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>

        <div>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to="/app/despesas">Despesas</Link></BreadcrumbItem>
            <BreadcrumbItem active>Manutenção</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <Alert color="warning" hidden={!notFound}>
          Não encontramos o que você procurava. <br></br>
          Por favor, tente novamente mais tarde!
        </Alert>

        {id && done ?
          <Alert color="warning">
            A movimentação já foi concluída. <br></br>
            Você poderá apenas visualizar as informações do recebimento.
          </Alert> : ''}

        <Row hidden={notFound}>
          <Col>
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Receitas - Manutenção</h3>
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
                      disabled={id && done}
                      value={description}
                      placeholder="Ex: Recebimento de ..."
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
                      disabled={id && done}
                      value={category}
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
                    <label className="form-control-label" htmlFor="bill-type-id">Conta Bancária:</label>
                    <Input
                      required
                      type="select"
                      name="bill"
                      disabled={id && done}
                      id="bill"
                      value={bill}
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
                      disabled={id && done}
                      type="text"
                      value={value}
                      onChangeEvent={e => setValue(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="name-bank">Vencimento em:</label>
                    <Input
                      required
                      type="date"
                      name="date"
                      id="date"
                      disabled={id && done}
                      value={moment(date).add(3, "hours").format('YYYY-MM-DD')}
                      onChange={e => setDate(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup hidden={id}>
                    <div className="custom-control custom-control-alternative custom-checkbox mb-3">
                      <input
                        className="custom-control-input"
                        id="doneExpense"
                        type="checkbox"
                        onChange={e => setDone(!done)}
                      />
                      <label className="custom-control-label" htmlFor="doneExpense">
                        Você já pagou o valor ?
                                    </label>
                    </div>
                    <div hidden={!done}>
                      <label className="form-control-label" htmlFor="dischargeDate">Pagamento em:</label>
                      <Input
                        required={done}
                        type="date"
                        id="dischargeDate"
                        value={moment(dischargeDate).format('YYYY-MM-DD')}
                        onChange={e => setDischargeDate(e.target.value)}
                      />
                    </div>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button color="success" type="submit" hidden={id && done} disabled={loading}>
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