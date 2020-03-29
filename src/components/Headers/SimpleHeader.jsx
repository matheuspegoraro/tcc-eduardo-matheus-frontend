import React from "react";

class SimpleHeader extends React.Component {
  render() {
    return (
      <>
        <div className={'header pb-0 pt-0 pt-md-7 bg-gradient-' + this.props.color}>
          
        </div>
      </>
    );
  }
}

export default SimpleHeader;
