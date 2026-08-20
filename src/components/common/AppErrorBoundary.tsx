import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[AFTERHOURS] Unhandled application error', error, info);
  }

  private reload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-viewport flex items-center justify-center bg-night-bg px-5 py-10 text-night-text">
        <section
          className="w-full max-w-md rounded-3xl border border-night-border bg-night-surface p-6 text-center shadow-2xl"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
            Signal interrupted
          </p>
          <h1 className="mt-3 font-serif text-2xl font-bold">AFTERHOURS failed to mount.</h1>
          <p className="mt-3 text-sm leading-relaxed text-night-muted">
            Your local profile and messages are still stored on this device. Reload to reconnect.
          </p>
          <button
            type="button"
            onClick={this.reload}
            className="mt-6 min-h-touch w-full rounded-2xl bg-brand-400 px-4 py-3 font-semibold text-night-bg transition-colors hover:bg-brand-300"
          >
            Reload AFTERHOURS
          </button>
        </section>
      </main>
    );
  }
}
