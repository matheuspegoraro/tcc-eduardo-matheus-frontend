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

  useEffect(() => {
    setMessages([
      new Message({ id: 1, message: 'Boa tarde, Matheus!', senderName: 'Mark' }),
      new Message({ id: 1, message: 'Poderia me passar o arquivo OFX para prosseguirmos com a conciliação bancária?', senderName: 'Mark' }),
      new Message({ id: 0, message: 'Só um momento. Estou enviando...', senderName: 'Mark' }),
    ]);
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    
    pushMessage(currentUser, message);
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

  const changeChat = () => {
    console.log('change');
  }

  return (
    <>
      <SimpleHeader
        color="info"
      />
      <Container fluid className="p-0 mt-2">
        <Row className='chat-container'>
          <Col lg="4" className='chat-list-container'>
            <ChatList
              className='chat-list'
              dataSource={[
                {
                    avatar: 'http://www.acaciocontabil.com.br/imagens/Noticias/quem-e-o-profissional-da-contabilidade-noticia-17050805.jpg',
                    alt: 'Reactjs',
                    title: 'Consultoria Contábil',
                    subtitle: 'Só um momento. Estou enviando...',
                    date: new Date(),
                    unread: 0,
                    statusText: 2,
                    statusColor: 'blue',
                    onClick: changeChat
                }
            ]} />
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