import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const {history} = props
  const redirectHome = () => {
    history.push('/')
  }
  const redirectJobs = () => {
    history.push('/jobs')
  }
  const redirectLogin = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <div className="mobile-nav-container">
        <Link to="/">
          <img
            className="mobile-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <ul className="mobile-nav-item-list">
          <li>
            <button
              onClick={redirectHome}
              className="mobile-nav-btn"
              type="button"
            >
              <AiFillHome className="icons-style" />
            </button>
          </li>
          <li>
            <button
              onClick={redirectJobs}
              className="mobile-nav-btn"
              type="button"
            >
              <BsBriefcaseFill className="icons-style" />
            </button>
          </li>
          <li>
            <button
              onClick={redirectLogin}
              className="mobile-nav-btn"
              type="button"
            >
              <FiLogOut className="icons-style" />
            </button>
          </li>
        </ul>
      </div>
      <div className="desktop-nav-container">
        <Link to="/">
          <img
            className="desktop-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <ul className="desktop-nav-item-list">
          <li className="nav-menu-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link className="nav-link" to="/jobs">
              Jobs
            </Link>
          </li>
        </ul>
        <button
          onClick={redirectLogin}
          className="desktop-logout-btn"
          type="button"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
