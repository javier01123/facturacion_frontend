import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }
    
    componentDidCatch(error, errorInfo) {
     this.setState({
        error: error,
        errorInfo: errorInfo
      });
    }
    
    render() {
      if (this.state.errorInfo) {
        return (
          <div>
            <h2>Ocurrió un error! </h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </div>
        );
      }
      // Render children if there's no error
      return this.props.children;
    }  
  }