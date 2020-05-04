import React, { useState, useEffect } from "react";
import {
  Tooltip,
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
  
  // form inputs
  const [modalCategory, setModalCategory] = useState(false);
  const [editIdCategory, setEditIdCategory] = useState(0);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);
  const [color, setColor] = useState('#000000');

  const [message, setMessage] = useState({type: '', message: ''});
  const [loading, setLoading] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  useEffect(() => {
    loadAll();
  }, [message]);

  async function loadAll() {
    setCategories([]);

    await api.get('/categories', {
      headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
    }).then(async response => {
      setCategories(response.data);
      setOptions(await listOptions(response.data, 0, []));
    });
  };

  function toggleModal() {
    setEditIdCategory(null);
    setName('');
    setParentId(null);
    setColor('#000000');
    
    setModalCategory(!modalCategory);
  }

  function toggleEditModal(category) {
    setEditIdCategory(category.id);
    setName(category.name);
    setColor(category.color);
    setParentId(category.parentId);

    setModalCategory(!modalCategory);
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (editIdCategory) {
      handleEdit();
    } else {
      handleCreate();
    }
  };

  async function handleCreate() {

    if (!name || !color) {
      setMessage({type: 'warning', message: "Preencha a descrição e selecione uma cor para continuar!"});
    } else {
      try {
        setLoading(true);

        const response = await api.post('/categories', { name, parentId, color }, {
          headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
        });

        if (response) {
          setMessage({type: 'success', message: "Categoria criada com suceso!"});
          toggleModal();
        }
      } catch (err) {
        setMessage({type: 'error', message: "Houve um problema ao cadastrar a categoria."});
        setLoading(false);
      }
    }
  };

  async function handleEdit() {

    if (!name || !color) {
      setMessage({type: 'warning', message: "Preencha a descrição e selecione uma cor para continuar!"});
    } else {
      try {
        setLoading(true);

        const response = await api.put(`/categories/${editIdCategory}`, { name, parentId, color }, {
          headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
        });

        if (response) {
          setMessage({type: 'success', message: "Categoria alterada com suceso!"});
          toggleModal();
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
      <Container className="mt-3 mb-4" fluid>
      <Modal
          className="modal-dialog-centered"
          isOpen={modalCategory}
          toggle={() => modalCategory}
        >
          <Form role="form" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalCategoryCreateLabel">
                {!editIdCategory ? 'Criar Nova Categoria': `Editar Categoria - ${name}`}
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => setModalCategory(!modalCategory)}
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
                        value={name}
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
                        id="select-parent"
                      >
                        Sub-categoria de
                      </label>
                      <Tooltip placement="top" isOpen={tooltipOpen} target="select-parent" toggle={toggle}>
                        Selecione a categoria "pai" desta nova categoria.
                      </Tooltip>
                      <Input
                        type="select"
                        className="form-control-alternative"
                        name="select-parent"
                        id="select-parent"
                        defaultValue={parentId}
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
                        name={color}
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
                onClick={() => setModalCategory(!modalCategory)}
              >
                Fechar
              </Button>
              <Button
                color="info"
                type="submit"
              >
                {!editIdCategory ? 'Criar!': 'Editar!'}
              </Button>
            </div>
          </Form>
        </Modal>

        <Row>
          <Col className="order-xl-1">
            <Card className="shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Lista de Categorias</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={() => setModalCategory(!modalCategory)}
                      size="sm"
                      disabled={loading ? true : false}
                    >
                      Criar
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {categories.length > 0 ? <Tree data={categories} listGroup={true} toggleEditModal={toggleEditModal} handleDelete={handleDelete} /> : <p className="h5">Encontramos 0 categoria(s) cadastradas.</p>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
  
}

export default Categories;
