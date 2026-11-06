import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a component error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white mb-1.5">
            Something went wrong
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            The screen encountered an unexpected display issue. Don't worry, your progress and data are safe!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReset}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <button
              onClick={this.handleReload}
              className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <details className="mt-8 text-left max-w-md w-full bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <summary className="cursor-pointer font-bold text-rose-500 mb-1">
                Technical Details
              </summary>
              <p className="text-rose-600 font-semibold">{this.state.error.toString()}</p>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
