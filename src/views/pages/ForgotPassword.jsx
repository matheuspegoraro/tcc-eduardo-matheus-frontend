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

class ForgotPassword extends React.Component {

  state = {
    email: '',
    error: '',
    loading: false
  };

  forgotPassword = async e => {
    e.preventDefault();
    const { email } = this.state;

    if (!email) {
      this.setState({ error: "Preencha e-mail para continuar!" });
    } else {
      try {
        this.setState({ loading: true });

        await api.post('/forgot_password', { email });
        this.props.history.push('/autenticar/recuperar-senha', { email_from_forgot_password: this.state.email });
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

  render() {

    const { loading } = this.state;

    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Será enviado para seu e-mail um código de recuperação para redefinir sua senha.</small>
                {this.state.error && <p>{this.state.error}</p>}
              </div>
              <Form role="form" onSubmit={this.forgotPassword}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Email" type="email" onChange={e => this.setState({ email: e.target.value })} />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit" disabled={loading}>
                    {loading && <i class="fas fa-spinner fa-pulse mr-2"></i>}
                    Enviar!
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

export default ForgotPassword;
