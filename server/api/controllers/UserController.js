var profiles = require('../../data/profiles.json').profiles;

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */

module.exports = {

  // Users Profiles page
  profiles: function (req, res) {
    // Init
    res.locals.pageTitle = 'User Profilez';

    // Fetch users
    var users = profiles;


    // Add users to view model
    res.locals.users = users;

    return res.view();
  }

};
