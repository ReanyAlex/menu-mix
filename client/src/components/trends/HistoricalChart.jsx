import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

const StyledXAxis = styled(XAxis)``;

class HistoricalChart extends Component {
  state = {
    name: '',
    data: [],
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

      data.forEach((snap, i) => {
        const m = moment(new Date(snap.date));
        const date = m.format('L');
        data[i].date = date;
      });

      this.setState({ data, name });
    });
  }

  renderFilter() {
    return (
      <form onClick={this.handleRadioClick.bind(this)} style={{ padding: '1rem 0 .5rem 3rem' }}>
        <fieldset>
          <legend>Click to chart specific data: </legend>
          <input defaultChecked type="radio" name="filter" value="costPercent" id="costPercent" />
          <label style={{ margin: '0 1rem' }} htmlFor="costPercent">
            Cost Percent
          </label>
          <input type="radio" name="filter" value="values" id="values" />
          <label style={{ margin: '0 1rem' }} htmlFor="values">
            Revenue Values
          </label>
          <input type="radio" name="filter" value="items" id="items" />
          <label style={{ margin: '0 1rem' }} htmlFor="items">
            Number Items Sold
          </label>
        </fieldset>
      </form>
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
      return <Line type="monotone" name="Cost %" dataKey="costPercent" stroke="orange" />;
    } else if (filter === 'values') {
      return this.renderValueLines();
    } else if (filter === 'items') {
      return this.renderItemLines();
    }
  }

  renderValueLines() {
    return [
      <Line key="1" type="monotone" name="Total Cost $" dataKey="totalCost" stroke="red" />,
      <Line key="2" type="monotone" name="Total Margin $" dataKey="totalMargin" stroke="blue" />,
      <Line key="3" type="monotone" name="Total Revenue $" dataKey="totalRevenue" stroke="green" />
    ];
  }

  renderItemLines() {
    const { data } = this.state;
    // console.log(data[data.length - 1].itemsSoldPerItem);
    return data[data.length - 1].itemsSoldPerItem.map((lineItem, i) => {
      const { _id, item, amount } = lineItem;
      return (
        <Line
          key={_id}
          type="monotone"
          name={item}
          dataKey={`itemsSoldPerItem[${i}].amount`}
          stroke={this.getRandomColor()}
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
        <Tooltip />
        <Legend dy={30} />

        {this.renderChartLine()}
      </LineChart>
    );
  }

  render() {
    // console.log(this.state.data);
    return (
      <div style={{ padding: '0rem 0 5rem 2rem' }}>
        <h3 style={{ paddingLeft: '3rem' }}>{`Historic Data Chart for ${this.state.name}`}</h3>
        {this.renderFilter()}
        {this.renderChart()}
      </div>
    );
  }
}

export default HistoricalChart;
