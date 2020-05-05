import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import {
  Button,
  Card,
  Label,
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

function Register(props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(null);

  useEffect(() => {
    if(error !== '')
      toast.error(error);
  }, [error]);

  const save = async (e, props) => {
    e.preventDefault();

    const { dispatch } = props;

    if (!companyName || !name || !email || !password || !type) {
      setError("Preencha todos os campos para continuar!");
    } else {
      try {
        setLoading(true);

        const companyResponse = await api.post('/companies', { 
          name: companyName,
          type
        });

        const companyId = companyResponse.data.id;

        const userResponse = await api.post('/users', { 
          name,
          email, 
          password,
          type,
          companyId
        });
        
        const { token, user } = userResponse.data;
        
        dispatch({
          type: 'ADD_TO_USER',
          user,
        });

        setToken(token);
        
        window.location.replace('/app/principal');
        setLoading(false);

        toast.success('Autenticação realizada com sucesso.');

      } catch (err) {
        setLoading(false);
        setError('Houve um problema com o login, verifique suas credênciais.');
      }
    }
  };

  const toPageForgotPassword = () => {
    props.history.push('/autenticar/esqueci-minha-senha');
  }

  const toPageLogin = () => {
    props.history.push('/autenticar/login');
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={e => save(e, props)}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-building" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Nome da empresa" 
                    type="text" 
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Seu nome" 
                    type="text"
                    onChange={e => setName(e.target.value)} 
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Seu e-mail" 
                    type="email" 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Senha de acesso" 
                    type="password" 
                    onChange={e => setPassword(e.target.value)} 
                  />
                </InputGroup>
              </FormGroup>
              <Row>
                <Col lg="6">
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="type" onChange={() => setType(1)} />{' '}
                      Sou cliente
                    </Label>
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="type" onChange={() => setType(2)} />{' '}
                      Sou prestador de serviços
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Cadastrar!
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <div
              className="text-light"
              onClick={toPageForgotPassword}
              style={{ cursor: 'pointer' }}
            >
              <small>Esqueci minha senha!</small>
            </div>
          </Col>
          <Col className="text-right" xs="6">
            <div
              className="text-light"
              onClick={toPageLogin}
              style={{ cursor: 'pointer' }}
            >
              <small>Já tenho minha conta!</small>
            </div>
          </Col>
        </Row>
      </Col>
    </>
  );
}

export default connect()(Register);