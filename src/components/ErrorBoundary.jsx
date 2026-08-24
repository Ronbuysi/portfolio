import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: String(error?.message || error) }
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('[Portfolio] runtime error:', error)
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary" role="alert">
        <strong>页面出现了一个错误</strong>
        <p>{this.state.message}</p>
        <button type="button" onClick={() => window.location.reload()}>重新加载</button>
      </div>
    }
    return this.props.children
  }
}
