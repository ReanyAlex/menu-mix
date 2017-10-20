import React from 'react';

const Dashboard = () => {
  return (
    <div className="container">
      <h3>Step 1</h3>
      <ul>
        <li>Login to the application with a google account </li>
      </ul>
      <h3>Step 2</h3>
      <ul>
        <li>Go to the items tab and create a new items</li>
      </ul>
      <h3>Step 3</h3>
      <ul>
        <li>Go to the colections tab and crate a new collection</li>
        <li>Add items to the collection</li>
      </ul>
      <h3>Step 4</h3>
      <ul>
        <li>In the collections tab click on the newly created collection</li>
        <li>Enter in the number of times each item was sold</li>
      </ul>
      <h3>Step 5</h3>
      <ul>
        <li>If you want to keep track of the data select a week from the calender</li>
        <li>Then hit Take SnapShot</li>
      </ul>
      <h3>Step 6</h3>
      <ul>
        <li>Repeat Step 5 till you collect the data for as many weeks as you like</li>
      </ul>
      <h3>Step 7</h3>
      <ul>
        <li>Got to the trends tab and click on a collection</li>
        <li>Click the different options to see different data charted</li>
      </ul>
      <h3>Editing Data</h3>
      <ul>
        <li>to edit item information go to the edit tab</li>
        <li>to edit collection information go to the collection tab</li>
        <li>to edit trend information go to the trend tab and click Trend Data for the collection you want to edit</li>
      </ul>
    </div>
  );
};

export default Dashboard;
