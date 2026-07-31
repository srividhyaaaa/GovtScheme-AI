import { Component } from "react";
import AppLayout from "./layouts/AppLayout";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Unhandled application error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="global-error-state">
          <h1>Something went wrong</h1>
          <p>Please refresh the page or return home and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  );
}

export default App;
