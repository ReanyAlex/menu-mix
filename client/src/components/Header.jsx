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
  margin-bottom: 2rem;
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
    const HEADER_LINKS = [
      { type: '', path: '/items', displayed: 'Items' },
      { type: '', path: '/collections', displayed: 'Collections' },
      { type: '', path: '/settings', displayed: 'Settings' },
      { type: 'last', path: '/api/logout', displayed: 'Logout' }
    ];

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
        return HEADER_LINKS.map(links => {
          const { type, path, displayed } = links;

          if (type === 'last') {
            return (
              <LastHeaderItem key={path} className="nav-item padding-right">
                <a href={path} className="nav-link">
                  <HeaderItem>{displayed}</HeaderItem>
                </a>
              </LastHeaderItem>
            );
          }

          return (
            <li key={path} className="nav-item">
              <Link to={path} className="nav-link ">
                <HeaderItem>{displayed}</HeaderItem>
              </Link>
            </li>
          );
        });
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
