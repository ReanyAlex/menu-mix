import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

const Title = styled.h3`padding-left: 3rem;`;
const FilterForm = styled.form`padding: 1rem 0 0.5rem 3rem;`;
const FormLabel = styled.label`margin: 0 1rem;`;

const TooltipBox = styled.div`
  background: white;
  padding: 1rem 1rem 0.5rem 1rem;
  border: 2px solid lightgray;
`;

const TooltipLabel = styled.p`font-size: 1.15rem;`;
const TooltipValue = styled.p`color: ${prompt => prompt.color};`;

class HistoricalChart extends Component {
  state = {
    name: '',
    data: [],
    itemsArray: [],
    filter: 'costPercent'
  };

  componentDidMount() {
    this.fetchHistoricalData();
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  fetchHistoricalData() {
    const { collection, id } = this.props.match.params;
    const url = `/api/collectionhistoricdata/?collection=${collection}/&id=${id}`;

    axios.get(url).then(res => {
      const name = res.data[0].collectionName;
      const data = res.data[0].snapShot;
      let itemsArray = [];
      // const itemsArray = [];
      data.forEach((snap, i) => {
        //set date format
        data[i].date = this.formatDate(snap);
        //create an array of items to create individual lines for
        itemsArray = this.createItemsArray(snap);
      });

      //reformat itemsSoldPerItem for chart needs to be placed last
      data.forEach((object, i) => {
        data[i].itemsSoldPerItem = this.formatData(object);
      });

      this.setState({ data, name, itemsArray });
    });
  }

  // ------------------------ functions for fetchHistoricalData ------------------------
  formatDate(snap) {
    const m = moment(new Date(snap.date));
    const date = m.format('L');
    return date;
  }

  createItemsArray(snap) {
    const itemsArray = [];
    snap.itemsSoldPerItem.forEach(item => {
      if (itemsArray.indexOf(item.item) === -1) {
        itemsArray.push(item.item);
      }
    });
    return itemsArray;
  }

  formatData(object) {
    let newObject = {};
    object.itemsSoldPerItem.forEach(item => {
      newObject[item.item] = item.amount;
    });
    return newObject;
  }
  // ------------------------ functions for fetchHistoricalData ------------------------

  renderFilter() {
    return (
      <FilterForm onClick={this.handleRadioClick.bind(this)}>
        <legend>Click to chart specific data: </legend>

        <input defaultChecked type="radio" name="filter" value="costPercent" id="costPercent" />
        <FormLabel htmlFor="costPercent">Cost Percent</FormLabel>
        <input type="radio" name="filter" value="values" id="values" />
        <FormLabel htmlFor="values">Revenue Values</FormLabel>
        <input type="radio" name="filter" value="items" id="items" />
        <FormLabel htmlFor="items">Number Items Sold</FormLabel>
      </FilterForm>
    );
  }

  handleRadioClick(e) {
    if (e.target.value === undefined) {
      return;
    }
    this.setState({ filter: e.target.value });
  }

  renderChartLine() {
    const { filter } = this.state;
    if (filter === 'costPercent') {
      return <Line type="monotone" name="Cost" dataKey="costPercent" stroke="orange" strokeWidth="4" />;
    } else if (filter === 'values') {
      return this.renderValueLines();
    } else if (filter === 'items') {
      return this.renderItemLines();
    }
  }

  renderValueLines() {
    const VALUELINES = [
      { name: 'Total Cost ', dataKey: 'totalCost', color: 'red' },
      { name: 'Total Margin ', dataKey: 'totalMargin', color: 'blue' },
      { name: 'Total Revenue ', dataKey: 'totalRevenue', color: 'green' }
    ];

    return VALUELINES.map(line => (
      <Line
        key={line.name}
        type="monotone"
        name={line.name}
        dataKey={line.dataKey}
        stroke={line.color}
        strokeWidth="4"
      />
    ));
  }

  renderItemLines() {
    const { itemsArray } = this.state;

    return itemsArray.map((lineItem, i) => {
      return (
        <Line
          key={i}
          type="monotone"
          name={lineItem}
          dataKey={`itemsSoldPerItem[${lineItem}]`}
          stroke={this.getRandomColor()}
          strokeWidth="4"
        />
      );
    });
  }

  renderChart() {
    let unit = ' $ ';

    if (this.state.filter === 'costPercent') unit = '%';
    if (this.state.filter === 'items') unit = '';
    return (
      <LineChart width={1000} height={600} data={this.state.data}>
        <XAxis dataKey="date" dy={10} />
        <YAxis unit={unit} />
        <CartesianGrid />
        <Tooltip content={this.renderTooltip.bind(this)} />

        <Legend dy={30} />

        {this.renderChartLine()}
      </LineChart>
    );
  }

  renderTooltip(data) {
    // console.log(this.state.data);
    if (data.payload === null) return;
    if (typeof data.payload[0] !== 'undefined') {
      return (
        <TooltipBox key="1">
          <TooltipLabel>{data.label}</TooltipLabel>
          {data.payload.map(payload => {
            let display = `${payload.value.toLocaleString('en', { style: 'currency', currency: 'USD' })}`;

            if (this.state.filter === 'costPercent') display = `%${payload.value}`;
            if (this.state.filter === 'items') display = payload.value;

            return (
              <TooltipValue key={payload.dataKey} color={payload.color}>
                {`${payload.name}: ${display}`}
              </TooltipValue>
            );
          })}
        </TooltipBox>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <Title>{`Historic Data Chart for ${this.state.name}`}</Title>
        {this.renderFilter()}
        {this.renderChart()}
      </div>
    );
  }
}

export default HistoricalChart;
