/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

const axios = require('axios');

const api = axios.create({
  baseURL: "http://localhost:3333"
});

class RecoveryPassword extends React.Component {

  state = {
    email: '',
    token: '',
    password: '',
    error: '',
    loading: false
  };

  recoveryPassword = async e => {
    e.preventDefault();
    const { email, token, password } = this.state;

    if (!email || !token || !password) {
      this.setState({ error: "Preencha todos os campos para continuar!" });
    } else {
      try {
        this.setState({ loading: true });

        await api.post('/reset_password', { email, token, password });
        this.props.history.push('/autenticar/login');
        localStorage.removeItem('api_token');
        this.setState({ loading: false });

      } catch (err) {
        console.log(err);
        this.setState({
          error:
            "Houve um problema na requisição!",
          loading: false
        });
      }
    }
  };

  componentDidMount() {
    if (this.props.location.state) {
      const { email_from_forgot_password } = this.props.location.state;
      this.setState({ email: this.props.location.state.email_from_forgot_password });
    }
  }

  render() {

    const { email, loading } = this.state;

    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Insira o código que você receber em seu e-mail, e redefina sua senha.</small>
              </div>
              <Form role="form" onSubmit={this.recoveryPassword}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="E-Mail" type="email" value={email} onChange={e => this.setState({ email: e.target.value })} />
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-tag" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Código" type="input" onChange={e => this.setState({ token: e.target.value })} />
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
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit" disabled={loading}>
                    {loading && <i class="fas fa-spinner fa-pulse mr-2"></i>}
                    Redefinir!
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default RecoveryPassword;
