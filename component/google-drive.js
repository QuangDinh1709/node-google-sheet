const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./../client_secret.json');

module.exports = {
  getData: function (sheetkey, parameters) {
      var doc = new GoogleSpreadsheet(sheetkey);
      return new Promise(function( resolve, reject) {
        doc.useServiceAccountAuth(creds, function(err) {
          if(err) reject(err);
          else {
            //get sheet id = 1 // PC list
            doc.getRows(1, {
              offset: 1,
              orderby : parameters.orderby_sheet1,
              reverse: true,
              query   : parameters.query_sheet1
            }, function(err, data) {
              if(err) reject(err);
              else {
                var id_sheet1 = data[0].id;
                var slaveName = data[0].jenkinsslavename;
                var clientType = parameters.clientType;
                // resolve(data);
                doc.getRows(2, {
                  offset : 1,
                  query : `jenkinsslavename=${slaveName}&mt4clienttypebroker=${clientType}&clientstatus=Idle`
                }, function( err, dataSheet2) {
                  if(err) reject(err);
                  else {
                    if(dataSheet2.length > 0) {
                      // resolve(dataSheet2);
                      resolve({
                              'idPCList' : id_sheet1,
                              'slaveName': dataSheet2[0].jenkinsslavename,
                              'path'     : dataSheet2[0].pathtoexcutableclient,
                              'idSlave'  : dataSheet2[0].id});
                    }
                    else {
                      reject('Not found');
                    }
                  }
                });
              }
            });
          }
        })
      });
  },

  updateData : function (sheetkey, parameters) {
    var doc = new GoogleSpreadsheet(sheetkey);
    return new Promise(function( resolve, reject) {
        doc.useServiceAccountAuth(creds, function(err) {
            if(err) reject(err);
            else {
              doc.getRows(1, {
                offset : 1,
                query  : parameters.query_sheet1
              }, function(err, data) {
                  if(err) reject(err);
                  else {
                    var number = parseInt(data[0].追加設置可能数numberofeacanbeadded,10);
                    data[0].追加設置可能数numberofeacanbeadded = number - 1;
                    number = parseInt(data[0].ea設置数numberofrunningeas,10);
                    data[0].ea設置数numberofrunningeas = number + 1;
                    data[0].save(() => {
                        //resolve(data);
                        doc.getRows(2, {
                            offset : 1,
                            query  : parameters.query_sheet2
                        }, function(err, dataSheet2){
                            dataSheet2[0].clientstatus = parameters.clientStatus;
                            dataSheet2[0].runningeaname = parameters.eaname;
                            dataSheet2[0].save();
                            resolve();
                        });
                    });
                  }
              });
            }
        });
    });
  }
}
