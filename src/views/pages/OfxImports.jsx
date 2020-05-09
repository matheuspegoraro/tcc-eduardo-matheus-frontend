import React, { useEffect, useState } from "react";
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

function OfxImports(props) {

  console.log(props);

  const [transactions, setTransactions] = useState([]);
  
  const [bills, setBills] = useState('');
  
  const [billId, setBillId] = useState('');
  const [fileOfx, setFileOfx] = useState('');
  const [fileName, setFileName] = useState('');
  const [labelFile, setLabelFile] = useState('Aguardando a importação do arquivo...');
  const [loading, setLoading] = useState(false);
  const [modalOfx, setModalOfx] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (fileOfx === ''){
      toast.warn('Nenhum arquivo encontrado!');
      return;  
    }

    let formData = new FormData();

    formData.append('fileOfx', fileOfx);
    formData.append('billId', billId);

    setLoading(true);

    try {
      const response = await api.post('/upload/ofx', formData, {
        headers: {
          'Content-Type': 'multpart/form-data',
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      const { transactions, file } = response.data;

      setTransactions(transactions);
      setFileName(file.name);
      setLoading(false);
      setModalOfx(!modalOfx);

      toast.success('Ofx importado com sucesso!');

    } catch (error) {
      
      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');
    
    }
  };

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

    if(bills.length > 0) setBillId(bills[0].id);

  }, [bills]);

  return (
    <>
      <HeaderWithDescription
        title="Importação do Extrato"
        description="Com o arquivo OFX (Open Financial Exchange), você realiza a importação do extrato bancário, mantendo suas informações financeiras sempre atualizadas."
        color="info"
      />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>
        <Modal
          className="modal-dialog-centered"
          isOpen={modalOfx}
          toggle={() => setModalOfx(!modalOfx)}
        >
          <Form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                Upload do Arquivo OFX
          </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => setModalOfx(!modalOfx)}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <FormGroup>
                <label className="form-control-label" htmlFor="bill-id">Conta Bancária:</label>
                <Input
                  type="select"
                  name="bill-id"
                  id="bill-id"
                  defaultValue={billId}
                  onChange={e => {
                    if (e.target.value !== '')
                      setBillId(e.target.value);
                  }}>
                  {bills.length > 0 ? bills.map(bill => {
                    return <option value={bill.id} key={bill.id}>{bill.name}</option>
                  }) : ''}
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
                    onChange={e => {
                      setFileOfx(e.target.files[0]);
                      setLabelFile(e.target.files[0].name);
                    }}
                  />
                  <label className="custom-file-label" htmlFor="upOFX">
                    {labelFile.length > 40 ? labelFile.substring(0,35) + '...' : labelFile }
                  </label>
                </div>
              </FormGroup>
            </div>
            <div className="modal-footer">
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() => setModalOfx(!modalOfx)}
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
                      onClick={() => setModalOfx(!modalOfx)}
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
                <p className="h5">{transactions.length} Transações encontradas no arquivo {fileName}</p>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default connect(state => ({
  user: state.user
}))(OfxImports);
