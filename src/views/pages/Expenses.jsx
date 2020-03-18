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
    Alert,
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';
import { formatSaveMoney, formatShowMoney } from '../../utils';
import moment from "moment";
import CurrencyInput from 'react-currency-input';

function Expenses() {

    const EXPENSES = 1;

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalExpenses, setModalExpenses] = useState(false);
    const [modalPay, setModalPay] = useState(false);

    //form inputs
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [bill, setBill] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [done, setDone] = useState(false);
    const [dischargeDate, setDischargeDate] = useState(null);

    const [expenseId, setExpenseId] = useState(null);

    //selects
    const [categories, setCategories] = useState([]);
    const [bills, setBills] = useState([]);

    function toggleModalPay() {
        setModalPay(!modalPay);
    }

    function toggleModal() {
        setExpenseId(null);
        setDescription('');
        setCategory('');
        setBill('');
        setValue('');
        setDate('');
        setDone(false);
        setModalExpenses(!modalExpenses);
    };

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

    useEffect(() => {

        async function fetchData() {
            const response = await api.get('/movements', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            setExpenses(response.data);
        }

        fetchData();

    }, [loading]);

    async function handleCreate() {

        const EXPENSE = 1;
        setLoading(true);

        try {
            const response = await api.post('/movements', {
                billId: bill,
                movementTypeId: EXPENSE,
                categoryId: category,
                name: description,
                value: formatSaveMoney(value),
                date
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            //setExpenses([...expenses, response.data]);

            toggleModal();
            toast.success('A movimentação foi adicionada com sucesso!');

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
            await api.put(`/movements/${expenseId}`, {
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

            toggleModal();

            toast.success('A movimentação foi alterada com sucesso!');

        } catch (e) {
            if (e.response) {
                const { error } = e.response.data;
                toast.error(error);
            }
        } finally {
            setLoading(false);
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (expenseId)
            handleEdit();
        else
            handleCreate();

    };

    async function handleMakePayment(expenseId) {
        setExpenseId(expenseId);
        toggleModalPay();
    }

    function toggleModalEditBank(id) {

        toggleModal();

        const expense = expenses.filter(expense => {
            return expense.id === id;
        })[0];

        setExpenseId(id);
        setDescription(expense.name);
        setCategory(expense.category.id);
        setBill(expense.bill.id);
        setValue(expense.value);
        setDate(expense.date);
        setDone(expense.done);

    };

    async function handleDelete(id) {

        setLoading(true);

        const newExpenses = expenses.filter(expense => {
            return expense.id !== id;
        });

        try {
            await api.delete(`/movements/${id}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            setExpenses(newExpenses);

            toast.success('A movimentação foi removida com sucesso!');

        } catch (e) {
            if (e.response) {
                const { error } = e.response.data;
                toast.error(error);
            }
        } finally {
            setLoading(false);
        };
    };

    async function undoPayment(id) {

        setLoading(true);

        try {
            await api.put(`/movements/undo-payment/${id}`, {
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            toast.success('O pagamento foi desfeito com sucesso!');

        } catch (e) {
            if (e.response) {
                const { error } = e.response.data;
                toast.error(error);
            }
        } finally {
            setLoading(false);
        };
    };

    async function makePayment(e) {

        e.preventDefault();

        setLoading(true);

        try {
            await api.post('/movements/make-payment', {
                movementId: expenseId,
                dischargeDate,
                value: formatSaveMoney(value)
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            toggleModalPay();

            toast.success('Pagamento realizado com sucesso!');


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
                title="Despesas"
                description="Permite o gerencimento de suas contas à pagar, você pode controlar a saída de valores na empresa e conferir pagamentos pendentes."
                color="danger"
            />
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={modalExpenses}
                    toggle={() => toggleModal()}
                >
                    <Form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalOfxLabel">
                                {expenseId ? 'Editar Despesa' : 'Cadastro de Despesas'}
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
                            {expenseId && done ?
                                <Alert color="warning">
                                    A movimentação já foi concluída. <br></br>
                                Você poderá apenas visualizar as informações do pagamento.
                            </Alert>
                                : ''}
                            <FormGroup>
                                <label className="form-control-label" htmlFor="name-bank">Descrição:</label>
                                <Input
                                    required
                                    id="description"
                                    type="text"
                                    disabled={expenseId && done}
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
                                    disabled={expenseId && done}
                                    defaultValue={category}
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
                                    disabled={expenseId && done}
                                    id="bill"
                                    defaultValue={bill}
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
                                    disabled={expenseId && done}
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
                                    disabled={expenseId && done}
                                    value={moment(date).format('YYYY-MM-DD')}
                                    onChange={e => setDate(e.target.value)}
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
                            <Button className="my-4" color="success" hidden={expenseId && done} type="submit" disabled={loading}>
                                {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                                {expenseId ? 'Editar!' : 'Criar!'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                <Modal
                    className="modal-dialog-centered"
                    isOpen={modalPay}
                    toggle={() => toggleModalPay()}
                >
                    <Form onSubmit={makePayment}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalPay">
                                Baixar Pagamentos
                            </h5>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => toggleModalPay()}
                            >
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <FormGroup>
                                <label className="form-control-label" htmlFor="name-bank">Pagamento em:</label>
                                <Input
                                    required
                                    type="date"
                                    name="dischargeDate"
                                    id="dischargeDate"
                                    onChange={e => setDischargeDate(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="name-bank">Valor pago:</label>
                                <Input
                                    required
                                    id="valueExpense"
                                    placeholder="Ex: R$ 20,00"
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    precision="2"
                                    type="text"
                                    tag={CurrencyInput}
                                    value={value}
                                    onChangeEvent={e => setValue(e.target.value)}
                                />
                            </FormGroup>
                        </div>
                        <div className="modal-footer">
                            <Button
                                color="secondary"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => toggleModalPay()}
                            >
                                Fechar
                             </Button>
                            <Button className="my-4" color="success" type="submit" disabled={loading}>
                                {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                                Pagar
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
                                        <h3 className="mb-0">Despesas</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button
                                            color="success"
                                            onClick={() => toggleModal()}
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
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Categoria</th>
                                        <th scope="col">Conta Bancária</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Vencimento em</th>
                                        <th scope="col">Pago</th>
                                        <th scope="col">Pago em</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map(expense => {
                                        return (
                                            <tr key={expense.id}>
                                                <td>{expense.name}</td>
                                                <td>{expense.category.name}</td>
                                                <td>{expense.bill.name}</td>
                                                <td>R$ {formatShowMoney(expense.value)}</td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {expense.date}
                                                    </Moment>
                                                </td>
                                                <td>
                                                    {expense.done ?
                                                        <span onClick={() => undoPayment(expense.id)} style={{ cursor: 'pointer' }} class="badge badge-success">Pago</span> :
                                                        <span onClick={() => handleMakePayment(expense.id)} style={{ cursor: 'pointer' }} class="badge badge-danger">Pendente</span>
                                                    }
                                                </td>
                                                <td>
                                                    {!expense.dischargeDate ?
                                                        '-' :
                                                        <Moment format="DD/MM/YYYY">
                                                            {expense.dischargeDate}
                                                        </Moment>
                                                    }
                                                </td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {expense.createdAt}
                                                    </Moment>
                                                </td>
                                                <td>
                                                    <Button
                                                        color="info"
                                                        onClick={() => toggleModalEditBank(expense.id)}
                                                        size="sm"
                                                        className="mt-1"
                                                    >
                                                        Alterar
                                                         </Button>
                                                    <Button
                                                        color="danger"
                                                        onClick={() => handleDelete(expense.id)}
                                                        size="sm"
                                                        className="ml-2 mt-1"
                                                    >
                                                        Remover
                                                         </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <CardFooter>
                                <p className="h5">Encontramos {expenses.filter(expense => (expense.companyId !== null)).length} despesas(s) cadastradas(s).</p>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default Expenses;