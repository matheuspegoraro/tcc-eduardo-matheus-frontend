import React, { Component } from 'react';
import { 
  Button, 
  ListGroup, 
  ListGroupItem, 
  Collapse 
} from 'reactstrap';
import Dot from "components/Utils/Dot.jsx";

class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data
    };
  }
  
  toggle = event => {
    const id = event.target.getAttribute('id');
    this.setState(state => ({ [id]: !state[id] }));
  }

  listGroup = (nodes, parentId, lvl) => {
    return nodes.map((node, index) => {
      const id = `${node.name}-${parentId ? parentId : 'top'}`.replace(/[^a-zA-Z0-9-_]/g, '');
      const item = 
        <React.Fragment key={id}>
            <ListGroupItem style={{ zIndex: 0 }} className={`${parentId ? `rounded-0 ${lvl ? 'border-bottom-0' : ''}` : ''}`}>
                {<div style={{ paddingLeft: `${25 * lvl}px` }}>
                    {node.children && <Button className="pl-0" color="link" id={id} onClick={this.toggle}>{this.state[id] ? '-' : '+'}</Button>}
                    <Dot size={20} backgroundColor={node.color}/>
                    <span className='mb-4'>{node.name}</span>
                    <Button
                      color="danger"
                      onClick={() => this.props.handleDelete(node.id)}
                      size="sm"
                      className="float-right ml-2 mt-1"
                    >
                      Remover
                    </Button>
                    <Button
                      color="info"
                      onClick={() => this.props.handleLoadEdit(node)}
                      size="sm"
                      className="float-right mt-1"
                    >
                      Alterar
                    </Button>
                </div>}
            </ListGroupItem>
            {node.children &&
            <Collapse isOpen={this.state[id]}>
                {this.listGroup(node.children, id, (lvl || 0) + 1)}
            </Collapse>}
        </React.Fragment>

      return item;
    });
  }

  render() {
    return (
      <ListGroup>
        {this.listGroup(this.state.data)}
      </ListGroup>
    )
  }
}

export default Tree;