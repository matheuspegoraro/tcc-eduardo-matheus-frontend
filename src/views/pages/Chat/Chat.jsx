import React, { useState, useEffect } from 'react';

import {
  Button,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";

import { ChatFeed, Message } from 'react-chat-ui';

import { ChatList } from 'react-chat-elements';

import SimpleHeader from "../../../components/Headers/SimpleHeader";

import 'react-chat-elements/dist/main.css';
import './styles.css';

import api from '../../../axios';
import { getTokenDecoded } from "../../../auth";

const users = {
  0: 'You',
  1: 'Mark',
};

const customBubble = props => (
  <div>
    <p>{`${props.message.senderName} ${props.message.id ? 'says' : 'said'}: ${
      props.message.message
    }`}</p>
  </div>
);

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [useCustomBubble, setUseCustomBubble] = useState(false);
  const [currentUser, setCurrentUser] = useState(0);

  const [advisorySelected, setAdvisorySelected] = useState(0);
  const [companies, setCompanies] = useState([]);

  const client = getTokenDecoded();

  useEffect(() => {
    const handleLoadAdvisories = async clientId => {

      let url = '';

      if (client.type === 2) {
        url = `/relationship-clients`;
      } else if (client.type === 1) {
        url = `/relationship-company/${clientId}`;
      }

      const response = await api.get(url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });
  
      setCompanies(response.data);
    }

    handleLoadAdvisories(client.companyId);
  }, [client.companyId]);

  const handleSubmit = async e => {
    e.preventDefault();

    const { data } = await api.post(`/messages`, 
      {
        senderId: client.companyId, 
        receiveId: advisorySelected,
        message
      }, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('api_token')}`
      }
    });

    setMessages((prevState) => [...prevState, new Message({ id: 0, message: message })]);
    setMessage('');
  }

  const pushMessage = (recipient, message) => {
    const newMessage = new Message({
      id: recipient,
      message,
      senderName: users[recipient],
    });

    setMessages([...messages, newMessage]);
  }

  const loadHistory = id => {
    const messages = async id => {

      const { data } = await api.get(`/messages`, {
        params: {
          senderId: client.companyId, receiveId: id
        },
        headers: {
          authorization: `Bearer ${localStorage.getItem('api_token')}`
        }
      });

      setMessages([]);

      data.map(message => {

        let sender;

        if (message.senderId === client.companyId) {
          sender = 0;
        } else {
          sender = 1;
        }

        setMessages((prevState) => [...prevState, new Message({ id: sender, message: message.message })])
      
      });
    }

    setAdvisorySelected(id);
    messages(id);
  
  }

  return (
    <>
      <SimpleHeader
        color="info"
      />
      <Container fluid className="p-0 mt-2">
        <Row className='chat-container'>
          <Col lg="4" className='chat-list-container'>
            { companies.map(companie => {

              let data;

              if (companie.clients) {
                data = companie.clients;
              } else if (companie.advisories) {
                data = companie.advisories;
              }

              return (
                <a key={data.id} href="#" onClick={() => loadHistory(data.id)}>
                  <ChatList
                    className='chat-list'
                    dataSource={[
                      {
                          avatar: 'http://www.acaciocontabil.com.br/imagens/Noticias/quem-e-o-profissional-da-contabilidade-noticia-17050805.jpg',
                          alt: 'Reactjs',
                          title: data.name,
                          subtitle: 'Só um momento. Estou enviando...', 
                          date: new Date(),
                          unread: 0,
                          statusText: 2,
                          statusColor: 'blue'
                      }
                  ]} />
                </a>
              )
            }) }            
          </Col>
          <Col lg="8">
            <div className="chatfeed-wrapper">
              <ChatFeed
                chatBubble={useCustomBubble && customBubble}
                maxHeight={250}
                messages={messages} // Boolean: list of message objects
                showSenderName
              />
              
              <Form role="form" onSubmit={handleSubmit}>
                <Row>
                  <Col lg="10">
                    <Input
                      className="form-control-alternative"
                      id="message"
                      placeholder="Digite uma mensagem"
                      type="text"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </Col>
                  <Col lg="2">
                    <Button
                      color="info"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Enviar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Chat