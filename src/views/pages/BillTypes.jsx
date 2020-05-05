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
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';

function BillTypes() {

  const [billTypes, setBillTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  //form inputs
  const [modalBillType, setModalBillType] = useState(false);
  const [name, setName] = useState('');

  const [editIdBillType, setEditIdBillType] = useState(null);

  function toggleModal() {
    setEditIdBillType(null);
    setName('');

    setModalBillType(!modalBillType);
  };

  function toggleEditModal(id) {

    const billTypeEditable = billTypes.filter(billType => {
      return billType.id === id;
    });

    if(billTypeEditable) {
      setEditIdBillType(billTypeEditable[0].id);
      setName(billTypeEditable[0].name);
      
      setModalBillType(!modalBillType);
    }

  };

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/bill-types', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setBillTypes(response.data);
    }

    fetchData();

  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (editIdBillType) {
      handleEdit();
    } else {
      handleCreate();
    }
  };

  async function handleCreate() {

    setLoading(true);

    try {
      await api.post('/bill-types', {
        name
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Tipo de Conta criada com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }
  };

  async function handleEdit() {

    setLoading(true);

    try {
      await api.put(`/bill-types/${editIdBillType}`, {
        name
      }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      toggleModal();
      toast.success('Tipo de Conta alterada com sucesso!');
      setLoading(false);

    } catch (error) {

      setLoading(false);
      toast.error('Ocorreu um erro na requisição!');

    }

  };

  async function handleDelete(id) {

    setLoading(true);

    const billType = billTypes.filter(billType => {
      return billType.id !== id;
    });

    if(billType) {
      try {
        await api.delete(`/bill-types/${id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('api_token')}`
          }
        });
      } catch (error) {
        setLoading(false);
      };
  
      toast.success('O tipo de conta foi removido com sucesso!');
      setLoading(false);
    } else {
      toast.error('Ocorreu um erro na requisição!');
    }

  };

  return (
    <>
      <HeaderWithDescription
        title="Tipo de Conta Bancária"
        description="Será utilizado para vincular numa nova conta bancária pelo cliente."
        color="info"
      />
      {/* Page content */}
      <Container className="mt-3 mb-4" fluid>
        <Modal
          className="modal-dialog-centered"
          isOpen={modalBillType}
          toggle={() => toggleModal()}
        >
          <Form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalOfxLabel">
                {!editIdBillType ? 'Adição de Tipo de Conta': `Alterar Tipo de Conta - ${name}`}
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
                <label className="form-control-label" htmlFor="name-bank">Nome do Tipo:</label>
                <Input
                  className="form-control"
                  id="bill-name"
                  placeholder="Ex: Conta corrente, conta poupança..."
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                {!editIdBillType ? 'Criar!': 'Editar!'}
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
                    <h3 className="mb-0">Tipos de Conta Bancária</h3>
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
                    <th scope="col">Nome</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {billTypes.map(billType => (
                    <tr key={billType.id}>
                      <td>{billType.name}</td>
                      <td>
                        <Moment format="DD/MM/YYYY">
                          {billType.createdAt}
                        </Moment>
                      </td>
                      <td>
                        <Button
                          color="info"
                          onClick={() => toggleEditModal(billType.id)}
                          size="sm"
                          className="mt-1"
                        >
                          Alterar
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => handleDelete(billType.id)}
                          size="sm"
                          className="ml-2 mt-1"
                        >
                          Remover
                        </Button>                      
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter>
                {/* <p className="h5">Encontramos {banksDefauts.length} banco(s) cadastrado(s).</p> */}
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BillTypes;
