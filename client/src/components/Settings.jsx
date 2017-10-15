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

    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  renderFormFeilds() {
    console.log('render');
    const FORM_DATA = [
      { type: 'text', value: 'companyName', displayed: 'Company' },
      { type: 'text', value: 'phoneNumber', displayed: 'Phone Number' },
      { type: 'textarea', value: 'address', displayed: 'Address' }
    ];

    return FORM_DATA.map(data => {
      const { type, value, displayed } = data;
      if (type === 'textarea') {
        return (
          <fieldset key={value}>
            <Label for="address">{displayed}:</Label>
            <TextArea
              onChange={e => this.handleChange(e)}
              rows="10"
              cols="40"
              name={value}
              id={value}
              value={this.state[value]}
            />
          </fieldset>
        );
      }

      return (
        <fieldset key={value}>
          <Label for={value}>{displayed}:</Label>
          <Input onChange={e => this.handleChange(e)} type="text" name={value} id={value} value={this.state[value]} />
        </fieldset>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <form action="/api/edit/settings" method="PUT">
            {this.renderFormFeilds()}
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
