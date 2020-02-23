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
  Col
} from "reactstrap";

import HeaderWithDescription from "components/Headers/HeaderWithDescription.jsx";
import Tree from "components/Utils/Tree.jsx";
import api from '../../axios';

function Categories() {

  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);
  const [color, setColor] = useState('#000000');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setCategories([]);
    // setOptions([]);

    const response = await api.get('/categories', {
      headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
    }).then(async response => {
      setCategories(response.data);
      setOptions(await listOptions(response.data, 0, []));
    });
  };

  async function create(e) {
    e.preventDefault();

    if (!name || !color) {
      setError("Preencha a descrição e selecione uma cor para continuar!");
    } else {
      try {
        setLoading(true);

        const response = await api.post('/categories', { name, parentId, color }, {
          headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
        });

        if (response) {
          alert('Sucesso!');
          loadAll();
        }
      } catch (err) {
        setError("Houve um problema ao cadastrar a categoria.");
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
        <Row>
          <Col className="order-xl-1">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <h3 className="mb-0">Criar Nova Categoria</h3>
              </CardHeader>
              <CardBody>
                <Form role="form" onSubmit={create}>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="5">
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
                      <Col lg="5">
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
                      <Col lg="1">
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
                    <Button
                      color="info"
                      type="submit"
                    >
                      Criar
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Card className="shadow mt-4 mb-4">
              <CardHeader className="border-0">
                <h3 className="mb-0">Lista de Categoias</h3>
              </CardHeader>
              <CardBody>
                {categories.length > 0 ? <Tree data={categories} listGroup={true} /> : ''}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
  
}

export default Categories;
