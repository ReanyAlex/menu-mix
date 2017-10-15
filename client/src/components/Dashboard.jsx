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
    </div>
  );
};

export default Dashboard;
