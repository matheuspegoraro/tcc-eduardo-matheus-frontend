import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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
    BreadcrumbItem,
    Breadcrumb,
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';
import { formatSaveMoney, formatShowMoney } from '../../utils';
import moment from "moment";
import CurrencyInput from 'react-currency-input';
import { confirm } from "../../components/Confirmations/Confirmation";

function Revenues() {

    const REVENUES = 2;

    const [revenues, setRevenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalRevenues, setModalRevenues] = useState(false);
    const [modalPay, setModalPay] = useState(false);

    //form inputs
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [bill, setBill] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [done, setDone] = useState(false);
    const [dischargeDate, setDischargeDate] = useState(null);

    const [revenueId, setRevenueId] = useState(null);

    //selects
    const [categories, setCategories] = useState([]);
    const [bills, setBills] = useState([]);

    function toggleModalPay() {
        setModalPay(!modalPay);
    }

    function toggleModal() {
        setRevenueId(null);
        setDescription('');
        setCategory('');
        setBill('');
        setValue('');
        setDate('');
        setDone(false);
        setModalRevenues(!modalRevenues);
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
            const response = await api.get('/movements/revenues', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            setRevenues(response.data);
        }

        fetchData();

    }, [loading]);

    async function handleCreate() {

        setLoading(true);

        try {
            await api.post('/movements/revenues', {
                billId: bill,
                movementTypeId: REVENUES,
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
            await api.put(`/movements/revenues/${revenueId}`, {
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

        if (revenueId)
            handleEdit();
        else
            handleCreate();

    };

    async function handleMakePayment(revenueId) {
        setRevenueId(revenueId);
        toggleModalPay();
    }

    function toggleModalEditBank(id) {

        toggleModal();

        const revenue = revenues.filter(revenue => {
            return revenue.id === id;
        })[0];

        setRevenueId(id);
        setDescription(revenue.name);
        setCategory(revenue.category.id);
        setBill(revenue.bill.id);
        setValue(revenue.value);
        setDate(revenue.date);
        setDone(revenue.done);

    };

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
                    isOpen={modalRevenues}
                    toggle={() => toggleModal()}
                >
                    <Form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalOfxLabel">
                                {revenueId ? 'Editar Receita' : 'Cadastro de Receitas'}
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
                            {revenueId && done ?
                                <Alert color="warning">
                                    A movimentação já foi concluída. <br></br>
                                Você poderá apenas visualizar as informações do recebimento.
                            </Alert>
                                : ''}
                            <FormGroup>
                                <label className="form-control-label" htmlFor="name-bank">Descrição:</label>
                                <Input
                                    required
                                    id="description"
                                    type="text"
                                    disabled={revenueId && done}
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
                                    disabled={revenueId && done}
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
                                    disabled={revenueId && done}
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
                                    disabled={revenueId && done}
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
                                    disabled={revenueId && done}
                                    value={moment(date).format('YYYY-MM-DD')}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup hidden={revenueId}>
                                <div className="custom-control custom-control-alternative custom-checkbox mb-3">
                                    <input
                                        className="custom-control-input"
                                        id="doneRevenue"
                                        type="checkbox"
                                        onChange={e => setDone(!done)}
                                    />
                                    <label className="custom-control-label" htmlFor="doneRevenue">
                                        Você já recebeu o valor ?
                                    </label>
                                </div>
                                <div hidden={!done}>
                                    <label className="form-control-label" htmlFor="dischargeDate">Recebimento em:</label>
                                    <Input
                                        required={done}
                                        type="date"
                                        id="dischargeDate"
                                        value={moment(dischargeDate).format('YYYY-MM-DD')}
                                        onChange={e => setDischargeDate(e.target.value)}
                                    />
                                </div>
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
                            <Button className="my-4" color="success" hidden={revenueId && done} type="submit" disabled={loading}>
                                {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                                {revenueId ? 'Editar!' : 'Criar!'}
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
                                    <Col xs="8">
                                        <h3 className="mb-0">Receitas</h3>
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
                                        <th scope="col">Recebido</th>
                                        <th scope="col">Recebimento em</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">Ações</th>
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
                                                    <Moment format="DD/MM/YYYY">
                                                        {revenue.date}
                                                    </Moment>
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
                                                <td>
                                                    <Button
                                                        color="info"
                                                        onClick={() => toggleModalEditBank(revenue.id)}
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