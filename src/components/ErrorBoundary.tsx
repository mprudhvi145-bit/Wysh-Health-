import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GlassCard, Button } from './UI';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surgical p-6">
          <GlassCard className="max-w-md w-full text-center border-red-500/30">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">System Critical Error</h2>
            <p className="text-text-secondary mb-6">
              The neural interface encountered an unexpected anomaly. Diagnostics have been logged.
            </p>
            <div className="p-4 bg-black/30 rounded-lg text-left mb-6 overflow-auto max-h-32">
                <code className="text-xs text-red-300 font-mono">
                    {this.state.error?.toString()}
                </code>
            </div>
            <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
                icon={<RefreshCw size={16} />}
                className="mx-auto"
            >
              Reboot System
            </Button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}