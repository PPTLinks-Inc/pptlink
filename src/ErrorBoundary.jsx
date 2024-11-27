/* eslint-disable react/prop-types */
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center z-50 absolute bg-black inset-0">
          <p className="text-slate-200 text-3xl text-center">
            Something terrible happened.
          </p>
          <p className="text-slate-200 mt-5 text-center">
            Reload the page to try again.
          </p>
          <p className="text-slate-200 mt-3 text-center">
            {this.state.error.toString()}
          </p>
          <button
            className="bg-slate-200 text-black p-3 mt-3 rounded-md"
            onClick={() => location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
