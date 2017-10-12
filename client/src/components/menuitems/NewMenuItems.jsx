import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';
import styled from 'styled-components';

import RenderForm from './RenderForm';

const Button = styled.input`
  display: block;
  font-size: 1.5rem;
  margin-left: 20px;
  margin-top: 20px;

  @media only screen and (min-width: 1200px) {
    display: inline-block;
    margin-top: 0;
  }
`;

const NewItemButton = styled.button`
  float: right;
  margin: 5rem 0;
  height: 60px;
  width: 60px;
  background-color: red;
  color: white;
  border-radius: 50%;
`;

class NewMenuItems extends Component {
  state = {
    numberOfNewItems: 0,
    itemName: [''],
    itemCost: [''],
    itemPrice: ['']
  };

  addOneNewItem() {
    this.setState({ numberOfNewItems: this.state.numberOfNewItems + 1 });
  }

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
    const numberOfForms = [];
    for (let i = 0; i <= this.state.numberOfNewItems; i++) {
      numberOfForms.push(
        <div key={i}>
          <RenderForm itemData={this.state} index={i} onChange={this.handleOnChange.bind(this)} />
        </div>
      );
    }
    return numberOfForms;
  }

  handleSubmit(event) {
    event.preventDefault();
    const itemObjectArray = [];
    const url = '/api/item';
    const { itemName, itemCost, itemPrice } = this.state;

    itemObjectArray.push(
      this.state.itemName.map((itemInfo, i) => {
        return { itemName: itemName[i], itemCost: itemCost[i], itemPrice: itemPrice[i] };
      })
    );

    axios.post(url, itemObjectArray).then(() => this.props.history.push('/items'));
  }

  render() {
    console.log(this.state);
    return (
      <div className="new-menu-item-div">
        <h1>Add New Menu Items</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          {this.renderForm()}
          <Button type="submit" />
          <NewItemButton onClick={() => this.addOneNewItem()}>Add</NewItemButton>
        </form>
      </div>
    );
  }
}

export default withRouter(NewMenuItems);
