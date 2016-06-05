/**
*   Repository for anything sigil-related
*
*/

var sigilRepo = function() {

  var getSigilsTest = function(req, res) {

    var result = [
    {
      url: 'http://placekitten.com/201/201',
      name: 'sigilOne'
    },
    {
      url: 'http://placekitten.com/201/203',
      name: 'sigilTwo'
    }
  ];

  res.writeHead(200, {'Content-Type': 'application/json'});
  var json = JSON.stringify(result);
  res.end(json);
  };

  /**
   * get by username
   */
  var getSigilsByUserId = function(req, username) {
    return new req.promise(function (resolve, reject) {
      req.db.fetchAll('SELECT * FROM sigils WHERE user_uuid = (SELECT uuid FROM users WHERE username = ?)', [username], function(err, result) {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  return {
    getSigilsTest: getSigilsTest,
    getSigilsByUserId: getSigilsByUserId
  }
}

module.exports = sigilRepo();