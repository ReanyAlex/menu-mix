const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const User = mongoose.model('users');

module.exports = app => {
  //PUT request to edit User data
  app.get('/api/edit/settings', async (req, res) => {
    // console.log(req.user);
    // console.log(req.query);

    await User.findById(req.user._id, (err, user) => {
      // Handle any possible database errors
      if (err) {
        res.status(500).send(err);
      }
      //updating user item
      user.companyName = req.query.companyName;
      user.phoneNumber = req.query.phoneNumber;
      user.address = req.query.address;
      user.save();
    });

    res.redirect('/');
  });

  app.get('/api/settings/:id', async (req, res) => {
    console.log('get');
    console.log(req.params.id);
    const userData = await User.findById(req.params.id, (err, user) => {
      // Handle any possible database errors
      if (err) {
        res.status(500).send(err);
      }

      return user;
    });

    await res.send(userData);
  });
};
