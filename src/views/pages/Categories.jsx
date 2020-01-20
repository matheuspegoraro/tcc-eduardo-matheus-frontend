import React from "react";
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
// core components
import SimpleHeader from "components/Headers/SimpleHeader.jsx";
import Dot from "components/Utils/Dot.jsx";
import Tree from "components/Utils/Tree.jsx";

const axios = require('axios');

const api = axios.create({
  baseURL: "http://localhost:3333"
});

class Categories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      options: [],
      name: '',
      parent_id: null,
      color: '#000000',
      error: '',
      loading: false
    };

    this.loadAll();
  }

  loadAll = async e => {
    const response = await api.get('/categories', {
      headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
    });

    if(response) {
      this.setState({categories: response.data});
      this.listOptions(this.state.categories);
    } 
  };

  create = async e => {
    e.preventDefault();

    const { name, parent_id, color } = this.state;
    if (!name || !color) {
      this.setState({ error: "Preencha a descrição e selecione uma cor para continuar!" });
    } else {
      try {
        this.setState({loading: true});
        
        const response = await api.post('/categories', { name, parent_id, color }, {
          headers: { authorization: `Bearer ${localStorage.getItem('api_token')}` }
        });

        if(response) {
          alert('Sucesso!');
          this.loadAll();
        } 
      } catch (err) {
        this.setState({
          error:
            "Houve um problema ao cadastrar a categoria.",
          loading: false  
        });
      }
    }
  };

  listOptions = (categories, lvl = 0) => {
    categories.map(category => {
      category.space = "-".repeat(lvl);

      if (category.children.length > 0) 
        this.listOptions(category.children, lvl + 1);

      this.setState({options: [...this.state.options, category]});
    });
  }

  render() {
    return (
      <>
        <SimpleHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <h3 className="mb-0">Criar Nova Categoria</h3>
                </CardHeader>
                <CardBody>
                  <Form role="form" onSubmit={this.create}>
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
                              onChange={e => this.setState({ name: e.target.value })}
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
                                  if(e.target.value !== '')
                                    this.setState({ parent_id: e.target.value });
                                  else
                                    this.setState({ parent_id: null });
                            }}>
                                <option value=''>Nenhum</option>
                                {this.state.options !== undefined ? this.state.options.map(category => {
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
                              onChange={e => this.setState({ color: e.target.value })}
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
                  {this.state.categories.length > 0 ? <Tree data={this.state.categories} listGroup={true} /> : ''}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Categories;
