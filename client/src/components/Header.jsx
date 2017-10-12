import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import styled from 'styled-components';

const Nav = styled.nav`
  min-width: 320px;
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
  background-color: lightblue;
  border-bottom: 1px solid lightgray;
`;
const HeaderItem = styled.span`
  color: gray;
  font-size: 1.25rem;
  padding-left: 10px;

  &:hover {
    color: white;
  }
`;

const HeaderLogo = styled.span`
  padding-left: 0.5rem;
  color: red;
  font-size: 1.5rem;
  font-weight: 500;

  &:hover {
    color: white;
  }

  @media only screen and (min-width: 576px) {
    font-size: 1.75rem;
  }
`;

const LastHeaderItem = styled.li`margin-right: 2rem;`;

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li className="nav-item">
            <a href="/auth/google" className="nav-link ">
              <HeaderItem>Login With Google</HeaderItem>
            </a>
          </li>
        );
      default:
        return [
          <li key="1" className="nav-item">
            <Link to="/items" className="nav-link ">
              <HeaderItem>Items</HeaderItem>
            </Link>
          </li>,
          <li key="2" className="nav-item">
            <Link to="/collections" className="nav-link">
              <HeaderItem>Collections</HeaderItem>
            </Link>
          </li>,
          <li key="3" className="nav-item">
            <Link to="/settings" className="nav-link">
              <HeaderItem>Settings</HeaderItem>
            </Link>
          </li>,
          <LastHeaderItem key="4" className="nav-item padding-right">
            <a href="/api/logout" className="nav-link">
              <HeaderItem>Logout</HeaderItem>
            </a>
          </LastHeaderItem>
        ];
    }
  }

  render() {
    return (
      <Nav className="navbar navbar-expand-md navbar-light">
        <Link className="navbar-brand" to="/">
          <HeaderLogo>RMA</HeaderLogo>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">{this.renderContent()}</ul>
        </div>
      </Nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(withRouter(Header));
