const googleDrive = require('./../component/google-drive');

module.exports = {
  getData : function(parameters) {
      return new Promise(function (resolve, reject) {
          console.log(parameters.parameters);
          googleDrive.getData(parameters.sheetkey, parameters.parameters)
            .then((result) => {
              resolve(result);
            }).
            catch((err) => {
              reject(err);
            });
      });
  },
  updateData : function(parameters) {
    return new Promise(function (resolve, reject) {
      googleDrive.updateData(parameters.sheetkey, parameters.parameters)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }
}
