import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';

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
    Breadcrumb,
    BreadcrumbItem
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../../axios';
import { toast } from 'react-toastify';
import { formatSaveMoney, formatShowMoney, monthNames } from '../../../utils';
import CurrencyInput from 'react-currency-input';
import { confirm } from "../../../components/Confirmations/Confirmation";


function Expenses() {

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalPay, setModalPay] = useState(false);

    //form inputs
    const [value, setValue] = useState('');
    const [dischargeDate, setDischargeDate] = useState(null);

    const [expenseId, setExpenseId] = useState(null);

    const history = useHistory();

    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);

    useEffect(() => {
        setCurrentMonth(moment().month() + 1);
        setCurrentYear(moment().year());
    }, []);

    function toggleModalPay() {
        setModalPay(!modalPay);
    }

    function addMonth(increase) {
        if(currentMonth === 12 && increase === 1) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(1);
        } else if(currentMonth === 1 && increase === -1) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(currentMonth + increase);
        }
    }

    useEffect(() => {

        async function fetchData() {
            const response = await api.get(`/movements/expenses?month=${currentMonth}&year=${currentYear}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            setExpenses(response.data);
        }

        fetchData();

    }, [loading, currentMonth]);



    async function handleMakePayment(expenseId) {
        setExpenseId(expenseId);
        toggleModalPay();
    }


    async function handleDelete(id) {

        if (await confirm("Você tem certeza que deseja excluir ? O lançamento será excluído permanentemente.",
            "Excluir",
            "Cancelar",
            "Confimar a exlusão ?",
            "danger")) {

            setLoading(true);

            const newExpenses = expenses.filter(expense => {
                return expense.id !== id;
            });

            try {
                await api.delete(`/movements/expenses/${id}`, {
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
            }
        }

    };

    async function undoPayment(id) {

        if (await confirm("Você tem certeza que deseja cancelar o pagamento ? O valor do lançamento será retornado à conta bancária.",
            "Confirmar",
            "Cancelar",
            "Cancelar Pagamento",
            "danger")) {

            setLoading(true);

            try {
                await api.put(`/movements/expenses/undo-payment/${id}`, {
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
            }
        }
    };

    async function makePayment(e) {

        e.preventDefault();

        setLoading(true);

        try {
            await api.post('/movements/expenses/make-payment', {
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
            <Container className="mt-3 mb-4" fluid>

                <div>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Despesas</BreadcrumbItem>
                    </Breadcrumb>
                </div>

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
                <Row>
                    <Col>
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="4">
                                        <h3 className="mb-0">Despesas</h3>
                                    </Col>
                                    <Col xs="4" className="text-center">
                                        <Button
                                            color="danger"
                                            onClick={() => addMonth(-1)}
                                            size="sm"
                                        >
                                            <i class="fa fa-arrow-left" aria-hidden="true"></i>
                                        </Button>
                                        <Button
                                            color="danger"
                                            size="sm"
                                            disabled={true}
                                        >
                                            {monthNames[currentMonth - 1]} / {currentYear}
                                        </Button>
                                        <Button
                                            color="danger"
                                            onClick={() => addMonth(+1)}
                                            size="sm"
                                        >
                                            <i class="fa fa-arrow-right" aria-hidden="true"></i>
                                        </Button>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button
                                            color="success"
                                            onClick={() => history.push('/app/despesas/novo')}
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
                                                    {moment(expense.date).add(3, "hours").format('DD/MM/YYYY')}
                                                </td>
                                                <td>
                                                    {expense.done ?
                                                        <div>
                                                            <span onClick={() => undoPayment(expense.id)} style={{ cursor: 'pointer' }} className="badge badge-success">Pago</span>
                                                        </div> :
                                                        <div>
                                                            <span onClick={() => handleMakePayment(expense.id)} style={{ cursor: 'pointer' }} className="badge badge-danger">Pendente</span>
                                                        </div>
                                                    }
                                                </td>
                                                <td>
                                                    {!expense.dischargeDate ?
                                                        '-' :
                                                        moment(expense.dischargeDate).add(3, "hours").format('DD/MM/YYYY')
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
                                                        onClick={() => history.push(`/app/despesas/${expense.id}/editar`)}
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