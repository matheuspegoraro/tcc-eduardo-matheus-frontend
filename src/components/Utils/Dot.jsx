import React from "react";

class Dot extends React.Component {
  render() {
    return (
        <span style={{
            height: `${this.props.size}px`, 
            width: `${this.props.size}px`, 
            backgroundColor: this.props.backgroundColor,
            borderRadius: '50%',
            display: 'inline-block'
        }}></span>
    );
  }
}

export default Dot;
