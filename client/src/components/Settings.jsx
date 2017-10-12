import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import styled from 'styled-components';

const Label = styled.label`
  display: block;
  position: relative;
  padding: 10px 0 0 0;
  margin: 0;
`;
const Input = styled.input`font-size: 1.5rem;`;
const TextArea = styled.textarea`font-size: 1.5rem;`;
const Button = styled.input`
  font-size: 1.5rem;
  margin-bottom: 3rem;
`;

class Settings extends Component {
  state = {
    companyName: '',
    phoneNumber: '',
    address: ''
  };

  componentDidMount() {
    if (this.props.auth === null) {
      return;
    } else {
      this.fetchUserData(this.props.auth._id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.fetchUserData(nextProps.auth._id);
  }

  fetchUserData(id) {
    const that = this;

    fetch(`/api/settings/${id}`)
      .then(res => res.json())
      .then(function(json) {
        //derstructed incoming object keys match the state objects
        that.setState({ ...json });
      });
  }

  handleChange(event) {
    const state = this.state;
    console.log(event.target.name);
    console.log(event.target.value);

    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div>
        <div className="container">
          <form action="/api/edit/settings" method="PUT">
            <Label for="companyName">Company:</Label>
            <Input
              onChange={e => this.handleChange(e)}
              type="text"
              name="companyName"
              id="companyName"
              value={this.state.companyName}
            />
            <Label for="phoneNumber">Phone Number:</Label>
            <Input
              onChange={e => this.handleChange(e)}
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={this.state.phoneNumber}
            />
            <Label for="address">Address:</Label>
            <TextArea
              onChange={e => this.handleChange(e)}
              rows="10"
              cols="40"
              type="text"
              name="address"
              id="address"
              value={this.state.address}
            />
            <br />
            <Button type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(withRouter(Settings));
