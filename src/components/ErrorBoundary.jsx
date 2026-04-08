import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, info)
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    const msg = this.state.error instanceof Error ? this.state.error.message : String(this.state.error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a] px-4 text-[#dce3eb]">
        <div className="glass w-full max-w-2xl rounded-2xl border border-red-500/20 p-6">
          <h1 className="text-lg font-semibold text-white">Se rompió el render</h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Copia este mensaje y pégalo aquí para corregirlo.
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-black/40 p-4 text-xs text-red-200">
            {msg}
          </pre>
          <button
            type="button"
            className="mt-4 rounded-xl bg-[#22c55e] px-4 py-2 text-sm font-semibold text-[#052e16]"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }
}

