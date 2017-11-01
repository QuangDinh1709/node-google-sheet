
module.exports = {
  startBuild : function(url, nameJob, parameters) {
    var jenkins = require('jenkins')({ url, crumbIssuer: true });
    return new Promise(function(resolve, reject) {
      jenkins.job.build(
        {
          name : nameJob,
          parameters : parameters
        }, function (err) {
        if(err) reject();
        else resolve();
      });
    });
  }
}
