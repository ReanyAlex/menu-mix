import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

class HistoricalChart extends Component {
  state = {
    name: '',
    data: [],
    filter: 'costPercent'
  };

  componentDidMount() {
    this.fetchHistoricalData();
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
      <form onClick={this.handleRadioClick.bind(this)}>
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
      return [
        <Line key="1" type="monotone" name="Total Cost $" dataKey="totalCost" stroke="red" />,
        <Line key="2" type="monotone" name=" Total Margin $" dataKey="totalMargin" stroke="blue" />,
        <Line key="3" type="monotone" name="Total Revenue $" dataKey="totalRevenue" stroke="green" />
      ];
    }
  }
  renderChart() {
    let unit = ' $ ';

    if (this.state.filter === 'costPercent') {
      unit = '%';
    }
    return (
      <LineChart width={1000} height={600} data={this.state.data}>
        <XAxis dataKey="date" />
        <YAxis unit={unit} />
        <CartesianGrid />
        <Tooltip />
        <Legend />
        {this.renderChartLine()}
      </LineChart>
    );
  }

  render() {
    console.log(this.state.data);
    return (
      <div className="container">
        <h3>{`Historic Data Chart for ${this.state.name}`}</h3>
        {this.renderFilter()}
        {this.renderChart()}
      </div>
    );
  }
}

export default HistoricalChart;
