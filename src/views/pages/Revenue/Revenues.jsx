import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';

import Moment from 'react-moment';
import moment from 'moment';

import CurrencyInput from 'react-currency-input';
import { toast } from 'react-toastify';

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
    BreadcrumbItem,
    Breadcrumb,
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../../axios';
import { formatSaveMoney, formatShowMoney, monthNames } from '../../../utils';
import { confirm } from "../../../components/Confirmations/Confirmation";

function Revenues(props) {

    const REVENUES = 2;

    const [revenues, setRevenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalPay, setModalPay] = useState(false);

    //form inputs
    const [value, setValue] = useState('');
    const [dischargeDate, setDischargeDate] = useState(null);

    const [revenueId, setRevenueId] = useState(null);

    const history = useHistory();

    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);

    const [clientCompanyId, setClientCompanyId] = useState(0);
    
    useEffect(() => {
        setCurrentMonth(moment().month() + 1);
        setCurrentYear(moment().year());

        if(props.location.state) {
            localStorage.setItem('clientCompanyId', props.location.state.clientCompanyId);
        }

        setClientCompanyId(parseInt(localStorage.getItem('clientCompanyId')));        

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

            let response;

            if (!clientCompanyId) {

                response = await api.get(`/movements/revenues?month=${currentMonth}&year=${currentYear}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

            } else {

                response = await api.get(`/relationship-company/revenues/${clientCompanyId}?month=${currentMonth}&year=${currentYear}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

            }

            setRevenues(response.data);
        }

        if (currentMonth !== 0 && currentYear !== 0) 
            fetchData();

    }, [loading, currentMonth]);


    async function handleMakePayment(revenueId) {
        setRevenueId(revenueId);
        toggleModalPay();
    }

    async function handleDelete(id) {

        if (await confirm("Você tem certeza que deseja excluir ? O lançamento será excluído permanentemente.",
            "Excluir",
            "Cancelar",
            "Confimar a exlusão ?",
            "danger")) {

            setLoading(true);

            const newRevenues = revenues.filter(revenue => {
                return revenue.id !== id;
            });

            try {
                await api.delete(`/movements/revenues/${id}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

                setRevenues(newRevenues);

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

        if (await confirm("Você tem certeza que deseja cancelar o recebimento ? O valor do lançamento será retornado à conta bancária.",
            "Confirmar",
            "Cancelar",
            "Cancelar Recebimento",
            "danger")) {

            setLoading(true);

            try {
                await api.put(`/movements/revenues/undo-receipt/${id}`, {
                }, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

                toast.success('O recebimento foi desfeito com sucesso!');

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
            await api.post('/movements/revenues/make-receipt', {
                movementId: revenueId,
                dischargeDate,
                value: formatSaveMoney(value)
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            toggleModalPay();

            toast.success('O recebimento realizado com sucesso!');

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
                title="Receitas"
                description="Permite o gerencimento de suas contas à receber, você pode controlar a entrada de valores na empresa e conferir recebimentos pendentes."
                color="success"
            />
            {/* Page content */}
            <Container className="mt-3 mb-4" fluid>

                <div>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Receitas</BreadcrumbItem>
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
                                Receber
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
                                <label className="form-control-label" htmlFor="name-bank">Recebimento em:</label>
                                <Input
                                    required
                                    type="date"
                                    name="dischargeDate"
                                    id="dischargeDate"
                                    onChange={e => setDischargeDate(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="name-bank">Valor recebido:</label>
                                <Input
                                    required
                                    id="valueRevenue"
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
                                Receber
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
                                        <h3 className="mb-0">Receitas</h3>
                                    </Col>
                                    <Col xs="4" className="text-center">
                                        <Button
                                            color="success"
                                            onClick={() => addMonth(-1)}
                                            size="sm"
                                        >
                                            <i class="fa fa-arrow-left" aria-hidden="true"></i>
                                        </Button>
                                        <Button
                                            color="success"
                                            size="sm"
                                            disabled={true}
                                        >
                                            {monthNames[currentMonth - 1]} / {currentYear}
                                        </Button>
                                        <Button
                                            color="success"
                                            onClick={() => addMonth(+1)}
                                            size="sm"
                                        >
                                            <i class="fa fa-arrow-right" aria-hidden="true"></i>
                                        </Button>
                                    </Col>
                                    {!clientCompanyId &&
                                        <Col className="text-right" xs="4">
                                            <Button
                                                color="success"
                                                onClick={() => history.push(`/app/receitas/novo`)}
                                                size="sm"
                                            >
                                                Novo
                                            </Button>
                                        </Col>
                                    }

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
                                        <th scope="col">Recebido</th>
                                        <th scope="col">Recebimento em</th>
                                        <th scope="col">Cadastrado em</th>
                                        {!clientCompanyId && <th scope="col">Ações</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {revenues.map(revenue => {
                                        return (
                                            <tr key={revenue.id}>
                                                <td>{revenue.name}</td>
                                                <td>{revenue.category.name}</td>
                                                <td>{revenue.bill.name}</td>
                                                <td>R$ {formatShowMoney(revenue.value)}</td>
                                                <td>
                                                    {moment(revenue.date).add(3, "hours").format('DD/MM/YYYY')}
                                                </td>
                                                <td>
                                                    {revenue.done ?
                                                        <div>
                                                            <span onClick={() => undoPayment(revenue.id)} style={{ cursor: 'pointer' }} className="badge badge-success">Realizado</span>
                                                        </div> :
                                                        <div>
                                                            <span onClick={() => handleMakePayment(revenue.id)} style={{ cursor: 'pointer' }} className="badge badge-danger">Pendente</span>
                                                        </div>
                                                    }
                                                </td>
                                                <td>
                                                    {!revenue.dischargeDate ?
                                                        '-' :
                                                        <Moment format="DD/MM/YYYY">
                                                            {revenue.dischargeDate}
                                                        </Moment>
                                                    }
                                                </td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {revenue.createdAt}
                                                    </Moment>
                                                </td>
                                                {
                                                    !clientCompanyId &&

                                                    <td>
                                                        <Button
                                                            color="info"
                                                            onClick={() => history.push(`/app/receitas/${revenue.id}/editar`)}
                                                            size="sm"
                                                            className="mt-1"
                                                        >
                                                            Alterar
                                                         </Button>
                                                        <Button
                                                            color="danger"
                                                            onClick={() => handleDelete(revenue.id)}
                                                            size="sm"
                                                            className="ml-2 mt-1"
                                                        >
                                                            Remover
                                                         </Button>
                                                    </td>
                                                }

                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <CardFooter>
                                <p className="h5">Encontramos {revenues.filter(revenue => (revenue.companyId !== null)).length} receita(s) cadastradas(s).</p>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default Revenues;