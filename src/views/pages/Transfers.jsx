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
    Breadcrumb,
    BreadcrumbItem
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';
import { formatSaveMoney, formatShowMoney } from '../../utils';
import moment from "moment";
import CurrencyInput from 'react-currency-input';
import { confirm } from "../../components/Confirmations/Confirmation";

function Transfers() {

    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalTransfer, setModalTransfer] = useState(false);

    //form inputs
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [bill, setBill] = useState('');
    const [billOut, setBillOut] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');

    //selects
    const [bills, setBills] = useState([]);
    const [categories, setCategories] = useState([]);

    function toggleModal() {
        setDescription('');
        setCategory('');
        setBill('');
        setBillOut('');
        setValue('');
        setDate('');
        setModalTransfer(!modalTransfer);
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
            const response = await api.get('/movements/transfers', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('api_token')}`
                }
            });

            setTransfers(response.data);
        }

        fetchData();

    }, [loading]);

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

            toggleModal();
            toast.success('A transferência foi realizada com sucesso!');

        } catch (e) {
            if (e.response) {
                const { error } = e.response.data;
                toast.error(error);
            }
        } finally {
            setLoading(false);
        };

    };

    async function handleSubmit(e) {
        e.preventDefault();
        handleCreate();
    };

    async function handleDelete(transferId) {

        if (await confirm("Você tem certeza que deseja excluir ? Os valores de transferência retornaram para as contas bancárias.",
            "Excluir",
            "Cancelar",
            "Confimar a exlusão ?",
            "danger")) {

            setLoading(true);

            const newTransfers = transfers.filter(transfer => {
                return transfer.id !== transferId;
            });

            try {
                await api.delete(`/movements/transfers/${transferId}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

                setTransfers(newTransfers);

                toast.success('A transferência foi removida com sucesso!');

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
                        <BreadcrumbItem active>Transferências</BreadcrumbItem>
                    </Breadcrumb>
                </div>

                <Modal
                    className="modal-dialog-centered"
                    isOpen={modalTransfer}
                    toggle={() => toggleModal()}
                >
                    <Form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalOfxLabel">
                                Realizar Transferência
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
                                Transferir!
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
                                        <h3 className="mb-0">Tranferências</h3>
                                    </Col>
                                    <Col className="text-right" xs="4">
                                        <Button
                                            color="success"
                                            onClick={() => toggleModal()}
                                            size="sm"
                                        >
                                            Tranferir
                                    </Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Conta Bancária (Entrada)</th>
                                        <th scope="col">Conta Bancária (Saída)</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Transferido em</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transfers.map(transfer => {
                                        return (
                                            <tr key={transfer.id}>
                                                <td>{transfer.name}</td>
                                                <td>{transfer.bill.name}</td>
                                                <td>{transfer.billOut.name}</td>
                                                <td>R$ {formatShowMoney(transfer.value)}</td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {transfer.date}
                                                    </Moment>
                                                </td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {transfer.createdAt}
                                                    </Moment>
                                                </td>
                                                <td>
                                                    <Button
                                                        color="danger"
                                                        onClick={() => handleDelete(transfer.id)}
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
                                <p className="h5">Encontramos {transfers.filter(transfer => (transfer.companyId !== null)).length} transferência(s) cadastradas(s).</p>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default Transfers;