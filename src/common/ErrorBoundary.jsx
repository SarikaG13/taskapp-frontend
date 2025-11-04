import React from 'react';
import toast from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("🧨 ErrorBoundary caught:", error, info);
    toast.error("Something went wrong. Please refresh or try again.");
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload(); // or navigate to a safe route
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          color: '#b00020',
          background: '#fff0f0',
          border: '1px solid #b00020',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2>🚨 Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={this.handleReset}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#b00020',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;