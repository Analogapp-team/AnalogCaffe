import React, { Component } from "react";

/* React class component that catches JavaScript errors in its child 
component tree and displays a fallback UI instead of crashing the entire app.*/ 
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

/* Static method is called when child component throws error
   Returns new state, sets hasError: true and stores error
   then Render phase is called during render, can't have side effects
   Synchronous: Must return state update immediately.
*/
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  

/* Side effects: Logging, analytics, error reporting */ 
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
