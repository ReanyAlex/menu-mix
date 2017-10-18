import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';
// import styled from 'styled-components';

import RenderForm from './RenderForm';

class EditItemForm extends Component {
  state = {
    _id: '',
    name: [''],
    category: [''],
    cost: [''],
    price: ['']
  };

  componentDidMount() {
    const { _id, name, category, cost, price } = this.props.item;
    this.setState({
      _id,
      name: [name],
      category: [category],
      cost: [cost / 100],
      price: [price / 100]
    });
  }
  addOneNewItem() {
    this.setState({ numberOfNewItems: this.state.numberOfNewItems + 1 });
  }

  //might have to work in this
  handleOnChange(event, index) {
    //extract values from form
    const { name, value } = event.target;
    //manipulate stare data indirectly
    const newState = this.state[name];
    newState[index] = value;

    //set state based on which form item is changed
    this.setState({ [name]: newState });
  }

  renderForm() {
    return <RenderForm itemData={this.state} index={0} onChange={this.handleOnChange.bind(this)} />;
  }

  //needs to be  changed for edit
  handleSubmit(event) {
    event.preventDefault();
    let { name, cost, price } = this.state;
    //matching MenuItem model
    const url = `/api/item/${this.state._id}`;
    name = name[0];
    cost = cost[0] * 100;
    price = price[0] * 100;

    const itemObject = { name, cost, price };
    axios.put(url, itemObject).then(() => this.props.finishedEdit());
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        {this.renderForm()}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  }
}

export default withRouter(EditItemForm);
