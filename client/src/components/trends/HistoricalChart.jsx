import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
// import styled from 'styled-components';

class HistoricalChart extends Component {
  state = {
    name: '',
    data: [],
    object: {},
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

      const array = [];
      data.forEach((snap, i) => {
        //set date format
        const m = moment(new Date(snap.date));
        const date = m.format('L');
        data[i].date = date;

        //create an array of items to creat individual lines for
        snap.itemsSoldPerItem.forEach(item => {
          if (array.indexOf(item.item) === -1) {
            array.push(item.item);
          }
        });
      });

      //reformat itemsSoldPerItem for chart needs to be placed last
      data.forEach((object, i) => {
        let newObject = [];
        object.itemsSoldPerItem.forEach(item => {
          newObject[item.item] = item.amount;
        });
        data[i].itemsSoldPerItem = newObject;
      });

      this.setState({ data, name, array });
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
    const { data, array } = this.state;

    /*shows the data for the last date instance of the collection.
    Error if there is an edit to the item name. This will not be showcased
    Also Major errors when switching out items in the collection  */
    return array.map((lineItem, i) => {
      console.log(lineItem);
      console.log(data[0].itemsSoldPerItem[lineItem]);
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
        <div key="1" style={{ background: 'white', padding: '1rem 1rem .5rem 1rem', border: '2px solid lightgray' }}>
          <p style={{ fontSize: '1.15rem' }}>{data.label}</p>
          {data.payload.map(payload => {
            let display = `${payload.value.toLocaleString('en', { style: 'currency', currency: 'USD' })}`;

            if (this.state.filter === 'costPercent') display = `%${payload.value}`;
            if (this.state.filter === 'items') display = payload.value;

            return (
              <p key={payload.dataKey} style={{ color: `${payload.color}` }}>
                {`${payload.name}: ${display}`}
              </p>
            );
          })}
        </div>
      );
    }
  }

  render() {
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

//under construction!!!!
// renderItemLines() {
//   const { data } = this.state;
//   // console.log(data);
//   /*shows the data for the last date instance of the collection.
//   Error if there is an edit to the item name. This will not be showcased
//   Also Major errors when switching out items in the collection  */
//   let counter = 0;
//   return data.map((object, i) => {
//     // console.log(object);
//
//     return object.itemsSoldPerItem.map((itemObject, j) => {
//       counter++;
//       console.log('counter', counter);
//       // console.log(object.date);
//       // console.log(data[i].itemsSoldPerItem[j].item);
//       // console.log({ name: itemObject.item, amount: itemObject.amount });
//       const { item, _id, amount } = itemObject;
//
//       return (
//         <Line
//           key={_id}
//           type="monotone"
//           name={item}
//           dataKey={`itemsSoldPerItem[${j}].amount`}
//           stroke={this.getRandomColor()}
//           strokeWidth="4"
//         />
//       );
//     });
//   });
// }
