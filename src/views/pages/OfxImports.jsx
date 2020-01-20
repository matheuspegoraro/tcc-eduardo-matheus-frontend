import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  CardFooter 
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import axios from "axios";
import uniqueId from "lodash.uniqueid";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

class OfxImports extends React.Component {

  state = {
    transactions: [],
    file_ofx: '',
    bank_id: '', //FIXO POR ENQUANTO
    company_id: '', //FIXO POR ENQUANTO
    error: '',
    file_name: '',
    loading: false
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    const { file_ofx, bank_id, company_id } = this.state;

    formData.append('file_ofx', file_ofx);
    formData.append('bank_id', bank_id);
    formData.append('company_id', company_id);

    this.setState({ loading: true });

    try {
      const response = await api.post('/upload/ofx', formData, {
        header: {
          'Content-Type': 'multpart/form-data'
        }
      });

      this.setState({ 
        transactions:  response.data.transactions,
        file_name: response.data.file.name,
        loading: false
      });

    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {

    const { transactions, file_name, loading } = this.state;

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1 mb-5 mb-xl-0" xl="4">
              <Card className=" shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Arquivo OFX</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      Informações Gerais
                    </h6>
                    <Row>
                      <Col>
                        <FormGroup>
                          <label className="form-control-label" htmlFor="inputBanco">Banco:</label>
                        <Input
                          className="form-control-alternative"
                          id="inputBanco"
                          placeholder="COLOCAR O ID DO BANCO (POR ENQUANTO)"
                          type="text"
                          onChange={e => this.setState({ bank_id: e.target.value })}
                        />
                        </FormGroup>
                        <FormGroup>
                          <label className="form-control-label" htmlFor="inputEmpresa">Empresa:</label>
                        <Input
                          className="form-control-alternative"
                          id="inputEmpresa"
                          placeholder="COLOCAR O ID DA EMPRESA (POR ENQUANTO)"
                          type="text"
                          onChange={e => this.setState({ company_id: e.target.value })}
                        />
                        </FormGroup>
                        <FormGroup>
                          <label className="form-control-label" htmlFor="upOFX">OFX:</label>
                          <Input type="file" name="file" id="upOFX" onChange={e => this.setState({ file_ofx: e.target.files[0] })} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button className="my-4" color="success" type="submit" disabled={loading}>
                    {loading && <i class="fas fa-spinner fa-pulse mr-2"></i>}
                    Importar!
                  </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-2" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Transações</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Selecionar todas
                      </Button>
                      <Button
                        color="success"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Confimar
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Selecionar</th>
                      <th scope="col">Data</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Valor</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr key={uniqueId()}>
                        <td>
                          <label className="custom-toggle">
                            <input defaultChecked type="checkbox" />
                            <span className="custom-toggle-slider rounded-circle" />
                          </label>
                        </td>
                        <td>10/01/2020</td>
                        <td>{transaction.MEMO}</td>
                        <td>Transferências</td>
                        <td style={{color: transaction.TRNTYPE == 'CREDIT' ? '#2dce89' : '#f5365c'}}>R$ {transaction.TRNAMT}</td>
                        <td className="text-right">
                          <i className="ni ni-ruler-pencil text-primary mr-3" />
                          <i className="ni ni-check-bold text-success" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <CardFooter>
                  <p className="h5">{transactions.length} Transações encontradas no arquivo {file_name}</p>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default OfxImports;
