import React from "react";
import { connect } from 'react-redux';

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
  Modal
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import uniqueId from "lodash.uniqueid";
import api from '../../axios';
import { toast } from 'react-toastify';

class OfxImports extends React.Component {

  state = {
    transactions: [],
    file_ofx: '',
    bank_id: '',
    error: '',
    file_name: '',
    label_file: 'Aguardando a importação do arquivo...',
    loading: false,
    modalOfx: false,
  };

  toggleModal = state => {
    this.setState({
      [state]: !this.state[state]
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { file_ofx, bank_id } = this.state;

    if (file_ofx === ''){
      toast.warn('Nenhum arquivo encontrado!');
      return;  
    }

    let formData = new FormData();

    formData.append('file_ofx', file_ofx);
    formData.append('bank_id', bank_id);

    this.setState({ loading: true });

    try {
      const response = await api.post('/upload/ofx', formData, {
        headers: {
          'Content-Type': 'multpart/form-data',
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      const { transactions, file } = response.data;

      this.setState({
        transactions: transactions,
        file_name: file.name,
        loading: false,
        modalOfx: false,
      });

      toast.success('Ofx importado com sucesso!');

    } catch (error) {
      console.log(error);
      this.setState({
        loading: false
      });
      toast.error('Ocorreu um erro na requisição!');
    }
  };

  render() {

    const { transactions, file_name, loading, label_file } = this.state;

    return (
      <>
        <HeaderWithDescription
          title="Importação do Extrato"
          description="Com o arquivo OFX (Open Financial Exchange), você realiza a importação do extrato bancário, mantendo suas informações financeiras sempre atualizadas."
          color="info"
        />
        {/* Page content */}
        <Container className="mt--7" fluid>

          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.modalOfx}
            toggle={() => this.toggleModal("modalOfx")}
          >
            <Form onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalOfxLabel">
                  Upload do Arquivo OFX
            </h5>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("modalOfx")}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <FormGroup>
                  <label className="form-control-label"  htmlFor="bank">Selecione o banco:</label>
                  <Input id="bank" type="select" onChange={e => this.setState({ bank_id: e.target.value })}>
                    <option value="1">Banco do Brasil</option>
                    <option value="2">Bradesco</option>
                    <option value="3">Sicoob</option>
                    <option value="4">Itaú</option>
                    <option value="5">Nubank</option>  
                  </Input>
                </FormGroup>
                <FormGroup>
                  <label className="form-control-label" htmlFor="upOFX">Arquivo OFX:</label>
                  <div className="custom-file">
                    <input
                      className="custom-file-input"
                      id="upOFX"
                      lang="br"
                      type="file"
                      onChange={e => this.setState({ file_ofx: e.target.files[0], label_file: e.target.files[0].name })}
                    />
                    <label className="custom-file-label" htmlFor="upOFX">
                      {label_file.length > 40 ? label_file.substring(0,35) + '...' : label_file }
                    </label>
                  </div>
                </FormGroup>
              </div>
              <div className="modal-footer">
                <Button
                  color="secondary"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("modalOfx")}
                >
                  Fechar
                </Button>
                <Button className="my-4" color="success" type="submit" disabled={loading}>
                  {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                  Importar!
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
                      <h3 className="mb-0">Transações</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="success"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Confimar
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => this.toggleModal("modalOfx")}
                        size="sm"
                      >
                        Upload...
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
                            <input type="checkbox" />
                            <span className="custom-toggle-slider rounded-circle" />
                          </label>
                        </td>
                        <td>10/01/2020</td>
                        <td>{transaction.MEMO}</td>
                        <td>Transferências</td>
                        <td style={{ color: transaction.TRNTYPE === 'CREDIT' ? '#2dce89' : '#f5365c' }}>R$ {transaction.TRNAMT}</td>
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

export default connect(state => ({
  user: state.user
}))(OfxImports);
