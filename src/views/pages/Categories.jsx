import React, { useState, useEffect } from "react";
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
  Modal
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import Tree from "components/Utils/Tree.jsx";
import api from '../../axios';
import { toast } from 'react-toastify';

function Categories() {

  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);
  
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);
  const [color, setColor] = useState('#000000');

  const [editIdCategory, setEditIdCategory] = useState(0);
  const [editName, setEditName] = useState('');
  const [editParentId, setEditParentId] = useState(null);
  const [editColor, setEditColor] = useState('#000000');

  const [message, setMessage] = useState({type: '', message: ''});
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  async function loadAll() {
    setCategories([]);

    await api.get('/categories', {
      headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
    }).then(async response => {
      setCategories(response.data);
      setOptions(await listOptions(response.data, 0, []));
    });
  };

  async function handleCreate(e) {
    e.preventDefault();

    if (!name || !color) {
      setMessage({type: 'warning', message: "Preencha a descrição e selecione uma cor para continuar!"});
    } else {
      try {
        setLoading(true);

        const response = await api.post('/categories', { name, parentId, color }, {
          headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
        });

        if (response) {
          resetFormCreate();
        }
      } catch (err) {
        setMessage({type: 'error', message: "Houve um problema ao cadastrar a categoria."});
        setLoading(false);
      }
    }
  };

  function resetFormCreate() {
    setMessage({type: 'success', message: "Categoria criada com suceso!"});
    setCreateModal(!createModal);
    setName('');
    setParentId(null);
    setColor('#000000');
    loadAll();
  }

  function resetFormEdit() {
    setMessage({type: 'success', message: "Categoria alterada com suceso!"});
    setEditModal(!editModal);
    setEditParentId(0);
    setEditName('');
    setEditIdCategory(null);
    setEditColor('#000000');
    loadAll();
  }

  async function handleEdit(e) {
    e.preventDefault();

    if (!editName || !editColor) {
      setMessage({type: 'warning', message: "Preencha a descrição e selecione uma cor para continuar!"});
    } else {
      try {
        setLoading(true);

        const response = await api.put(`/categories/${editIdCategory}`, { name: editName, parentId: editParentId, color: editColor }, {
          headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
        });

        if (response) {
          resetFormEdit();
        }
      } catch (err) {
        setMessage({type: 'error', message: "Houve um problema ao editar a categoria."});
        setLoading(false);
      }
    }
  };

  async function handleDelete(idCategory) {
    if (idCategory) {
      try {
        setLoading(true);

        const response = await api.delete(`/categories/${idCategory}`, {
          headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
        });

        if (response) {
          setMessage({type: 'success', message: "Categoria removida com sucesso!"});
          loadAll();
        }
      } catch (err) {
        setMessage({type: 'error', message: "Houve um problema ao remover a categoria."});
        setLoading(false);
      }
    }
  };

  function handleLoadEdit(node) {
    setEditName(node.name);
    setEditParentId(node.parentId);
    setEditColor(node.color);
    setEditIdCategory(node.id);

    setEditModal(!editModal);
  };

  async function listOptions(tempCategories, lvl = 0, tempOptions) {   
    tempCategories.forEach(async category => {

      category.space = "-".repeat(lvl);
      
      tempOptions.push(category);

      if (category.children.length > 0)
        await listOptions(category.children, lvl + 1, tempOptions);
    });

    return tempOptions;
  }

  useEffect(() => {
    switch (message.type) {
      case 'error':
        toast.error(message.message);
        break;
    
      case 'warning':
        toast.warning(message.message);
        break;
      
      case 'success':
        toast.success(message.message);
        break;
    }
  }, [message]);

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <>
      <HeaderWithDescription 
        title="Categorias de Contas" 
        description="Utilize as categorias para separar, filtrar e gerenciar seu fluxo de caixa."
        color="info"
      /> 
      {/* Page content */}
      <Container className="mt--7" fluid>
      <Modal
          className="modal-dialog-centered"
          isOpen={createModal}
          toggle={() => createModal}
        >
          <Form role="form" onSubmit={handleCreate}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalCategoryCreateLabel">
                Criar Nova Categoria
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => setCreateModal(!createModal)}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-name"
                      >
                        Descrição
                      </label>
                      <Input
                        className="form-control-alternative"
                        defaultValue=""
                        id="input-name"
                        placeholder="Alimentação, transporte..."
                        type="text"
                        onChange={e => setName(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="select-parent"
                      >
                        Sub-categoria de
                      </label>
                      <Input
                        type="select"
                        className="form-control-alternative"
                        name="selectMulti"
                        id="exampleSelectMulti"
                        onChange={e => {
                          if (e.target.value !== '')
                            setParentId(e.target.value);
                          else
                            setParentId(null);
                        }}>
                        <option value=''>Nenhum</option>
                        {options !== undefined ? options.map(category => {
                          return <option value={category.id} key={category.id}>
                            {category.space} {category.name}
                            {/* <Dot size={5} backgroundColor={category.color}/>  */}
                          </option>
                        }) : ''}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-color"
                      >
                        Cor
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="input-color"
                        type="color"
                        onChange={e => setColor(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="modal-footer">
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() => setCreateModal(!createModal)}
              >
                Fechar
              </Button>
              <Button
                color="info"
                type="submit"
              >
                Criar
              </Button>
            </div>
          </Form>
        </Modal>

        <Modal
          className="modal-dialog-centered"
          isOpen={editModal}
          toggle={() => editModal}
        >
          <Form role="form" onSubmit={handleEdit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalCategoryEditLabel">
                Editar Categoria
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => setEditModal(!editModal)}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-name"
                      >
                        Descrição
                      </label>
                      <Input
                        className="form-control-alternative"
                        defaultValue=""
                        id="input-edit-name"
                        placeholder="Alimentação, transporte..."
                        type="text"
                        onChange={e => setEditName(e.target.value)}
                        defaultValue={editName}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="select-parent"
                      >
                        Sub-categoria de
                      </label>
                      <Input
                        type="select"
                        className="form-control-alternative"
                        name="selectMulti"
                        id="exampleSelectMulti"
                        defaultValue={editParentId}
                        onChange={e => {
                          if (e.target.value !== '')
                            setEditParentId(e.target.value);
                          else
                            setEditParentId(null);
                        }}>
                        <option value=''>Nenhum</option>
                        {options !== undefined ? options.map(category => {
                          return <option value={category.id} key={category.id}>
                            {category.space} {category.name}
                            {/* <Dot size={5} backgroundColor={category.color}/>  */}
                          </option>
                        }) : ''}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <label
                        className="form-control-label"
                        htmlFor="input-color"
                      >
                        Cor
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="input-color"
                        type="color"
                        defaultValue={editColor}
                        onChange={e => setEditColor(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="modal-footer">
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={() => setEditModal(!editModal)}
              >
                Fechar
              </Button>
              <Button
                color="info"
                type="submit"
              >
                Alterar
              </Button>
            </div>
          </Form>
        </Modal>
        
        <Row>
          <Col className="order-xl-1">
            <Card className="shadow mt-4 mb-4">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Lista de Categoias</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={() => setCreateModal(!createModal)}
                      size="sm"
                    >
                      Criar
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {categories.length > 0 ? <Tree data={categories} listGroup={true} handleLoadEdit={handleLoadEdit} handleDelete={handleDelete} /> : ''}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
  
}

export default Categories;
