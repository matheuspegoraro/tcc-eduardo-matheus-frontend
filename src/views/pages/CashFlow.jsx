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
import api from '../../axios';
import { toast } from 'react-toastify';
import { formatShowMoney, monthNames } from '../../utils';
import { confirm } from "../../components/Confirmations/Confirmation";

function CashFlow(props) {

    const [movements, setMovements] = useState([]);

    const [loading, setLoading] = useState(false);

    const clientCompanyId = props.location.state ? props.location.state.clientCompanyId : null;

    //history
    const history = useHistory();

    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);

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
    }, []);

    useEffect(() => {

        async function fetchData() {

            let response;

            if (!clientCompanyId) {

                response = await api.get(`/movements/cash-flow?month=${currentMonth}&year=${currentYear}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

            } else {

                response = await api.get(`/relationship-company/cash-flow/${clientCompanyId}?month=${currentMonth}&year=${currentYear}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('api_token')}`
                    }
                });

            }
            console.log(response.data);
            setMovements(response.data);
        }

        fetchData();

    }, [currentMonth]);

    return (
        <>
            <HeaderWithDescription
                title="Fluxo de Caixa"
                description="Permite a visualização das movimentações com baixa num determinado período."
                color="orange"
            />
            {/* Page content */}
            <Container className="mt-3 mb-4" fluid>

                <div>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/app/principal">Dashboard</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Fluxo de Caixa</BreadcrumbItem>
                    </Breadcrumb>
                </div>

                <Row>
                    <Col>
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="4">
                                        <h3 className="mb-0">Movimentações no Período</h3>
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
                                    <Col xs="4" className="text-center"></Col>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Conta Bancária</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Transferido em</th>
                                        <th scope="col">Cadastrado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.map(movement => {
                                        return (
                                            <tr key={movement.id} class={`bg-${(movement.movementTypeId == 1 ? 'danger' : (movement.movementTypeId == 2 ? 'success' : 'info'))} text-white text-bold`}>
                                                <td>{movement.name}</td>
                                                <td>{movement.bill.name}</td>
                                                <td>R$ {formatShowMoney(movement.value)}</td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {movement.date}
                                                    </Moment>
                                                </td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {movement.createdAt}
                                                    </Moment>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <CardFooter>
                                <p className="h5">Encontramos {movements.filter(movement => (movement.companyId !== null)).length} movimentaçõe(s) cadastradas(s).</p>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default CashFlow;