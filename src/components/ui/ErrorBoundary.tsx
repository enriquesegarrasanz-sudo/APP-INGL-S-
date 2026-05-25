import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white border border-border-light rounded-2xl p-8 shadow-md text-center">
            <h2 className="text-2xl font-black text-text mb-3">Algo ha fallado</h2>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Ha ocurrido un error inesperado. Puedes recargar la pagina para continuar.
              Tus datos estan guardados en el navegador.
            </p>
            {this.state.error && (
              <pre className="text-xs text-danger bg-danger-bg rounded-lg p-3 mb-6 text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-accent text-white rounded-xl font-bold text-base cursor-pointer border-none hover:opacity-90 transition-opacity shadow-btn"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
