import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  loginFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  submitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.loginSuccess(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  renderUsernameField = () => (
    <div className="input-container">
      <label className="label-text" htmlFor="username">
        USERNAME
      </label>
      <br />
      <input
        className="input-field"
        onChange={this.onChangeUsername}
        id="username"
        type="text"
        placeholder="Username"
      />
    </div>
  )

  renderPasswordField = () => (
    <div className="input-container">
      <label className="label-text" htmlFor="password">
        PASSWORD
      </label>
      <br />
      <input
        className="input-field"
        onChange={this.onChangePassword}
        id="password"
        type="password"
        placeholder="Password"
      />
    </div>
  )

  renderLoginContainer = () => {
    const {showErrorMsg, errorMsg} = this.state
    return (
      <form className="login-container" onSubmit={this.submitLoginForm}>
        <img
          className="logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        {this.renderUsernameField()}
        {this.renderPasswordField()}
        <button className="login-btn" type="submit">
          Login
        </button>
        {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return <div className="app-container">{this.renderLoginContainer()}</div>
  }
}

export default Login
