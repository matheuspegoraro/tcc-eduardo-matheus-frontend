import React from "react";

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col
} from "reactstrap";

import api from '../../axios';
import { toast } from 'react-toastify';

class ForgotPassword extends React.Component {

  state = {
    email: '',
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

        this.setState({
          loading: false
        });

        toast.error('Houve um problema na requisição!');

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
