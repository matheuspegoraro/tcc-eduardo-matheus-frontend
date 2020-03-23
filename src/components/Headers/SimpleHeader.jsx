import React from "react";

class SimpleHeader extends React.Component {
  render() {
    return (
      <>
        <div className={'header pb-8 pt-5 pt-md-8 bg-gradient-' + this.props.color}>
          
        </div>
      </>
    );
  }
}

export default SimpleHeader;
