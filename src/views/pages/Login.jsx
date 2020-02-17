import React from "react";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

import { setToken } from "../../auth";
import api from '../../axios';

class Login extends React.Component {

  state = {
    email: '',
    password: '',
    loading: false
  };

  signIn = async e => {
    e.preventDefault();

    const { email, password } = this.state;
    const { dispatch } = this.props;

    if (!email || !password) {
      this.setState({ error: "Preencha e-mail e senha para continuar!" });
    } else {
      try {
        this.setState({ loading: true });

        const response = await api.post('/authenticate', { email, password });
        const { token, user } = response.data;
        
        dispatch({
          type: 'ADD_TO_USER',
          user,
        });

        setToken(token);
        this.props.history.push('/dashboard/principal');
        this.setState({ loading: false });
        
      } catch (err) {
        this.setState({loading: false});
        toast.error('Houve um problema com o login, verifique suas credênciais.');
      }
    }
  };

  toPageForgotPassword = () => {
    this.props.history.push('/autenticar/esqueci-minha-senha');
  }

  render() {

    const { loading } = this.state;

    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Acessar com</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Ou acessar com minhas credênciais</small>
              </div>
              <Form role="form" onSubmit={this.signIn}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="E-Mail" type="email" onChange={e => this.setState({ email: e.target.value })} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Senha" type="password" onChange={e => this.setState({ password: e.target.value })} />
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Lembrar-me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit" disabled={loading}>
                    {loading && <i className="fas fa-spinner fa-pulse mr-2"></i>}
                    Acessar!
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <div
                className="text-light"
                onClick={this.toPageForgotPassword}
                style={{ cursor: 'pointer' }}
              >
                <small>Esqueci minha senha!</small>
              </div>
            </Col>
            <Col className="text-right" xs="6">
              <div
                className="text-light"
                onClick={e => e.preventDefault()}
                style={{ cursor: 'pointer' }}
              >
                <small>Criar uma conta!</small>
              </div>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default connect()(Login);
