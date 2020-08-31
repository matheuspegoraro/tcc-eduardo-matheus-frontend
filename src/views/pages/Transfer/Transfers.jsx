import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';

import Moment from 'react-moment';
import moment from 'moment';

import {
    Button,
    Card,
    CardHeader,
    Container,
    Row,
    Col,
    Table,
    CardFooter,
    Breadcrumb,
    BreadcrumbItem
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../../axios';
import { toast } from 'react-toastify';
import { formatShowMoney, monthNames } from '../../../utils';
import { confirm } from "../../../components/Confirmations/Confirmation";

function Transfers(props) {

    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);

    const [clientCompanyId, setClientCompanyId] = useState(0);

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
        setCurrentMonth(moment().month() + 1);
        setCurrentYear(moment().year());

        if(props.location.state) {
            localStorage.setItem('clientCompanyId', props.location.state.clientCompanyId);
        }

        setClientCompanyId(parseInt(localStorage.getItem('clientCompanyId')));
    }, []);

    //history
    const history = useHistory();

    useEffect(() => {

        async function fetchData() {

            let response;

            if (!clientCompanyId) {

                response = await api.get(`/movements/transfers?month=${currentMonth}&year=${currentYear}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

            } else {

                response = await api.get(`/relationship-company/transfers/${clientCompanyId}?month=${currentMonth}&year=${currentYear}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

            }
            
            if (currentMonth !== 0 && currentYear !== 0) 
                setTransfers(response.data);
        }

        fetchData();

    }, [loading, currentMonth]);


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

                <Row>
                    <Col>
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="4">
                                        <h3 className="mb-0">Tranferências</h3>
                                    </Col>
                                    <Col xs="4" className="text-center">
                                        <Button
                                            color="success"
                                            onClick={() => addMonth(-1)}
                                            size="sm"
                                        >
                                            <i className="fa fa-arrow-left" aria-hidden="true"></i>
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
                                            <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                        </Button>
                                    </Col>
                                    { !clientCompanyId &&
                                        <Col className="text-right" xs="4">
                                            <Button
                                                color="success"
                                                onClick={() => history.push('/app/transferencias/novo')}
                                                size="sm"
                                            >
                                                Tranferir
                                        </Button>
                                        </Col>
                                    }
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
                                        { !clientCompanyId && <th scope="col">Ações</th> }
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
                                                { !clientCompanyId && 
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
                                                }
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