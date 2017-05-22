var responseFormater = require('../../helpers/format-response.js');

var getAllEventsByID = function(id, callback){
  Event.find({ bsu_id: id }).exec(function (err, records) {
    callback(responseFormater.success("All events", records));
    return;
  });
}

var getAllByIDs = function (idArray, callback) {
  Event.find({ bsu_id: idArray }).exec(function (err, records) {
    callback(responseFormater.success("All events", records));
    return;
  });
}

var getAllEventsByHall = function(hall, callback){
  Event.find({ hall: hall }).exec(function (err, events) {
    callback(responseFormater.success("All " + hall + " Events", events));
    return;
  });
}

var getEventByMongoID = function (id, callback) {
  Event.find({ id: id }).exec(function (err, event) {
    if (err) {
      callback(err);
      return
    }

    callback(null, event);
    return;
  });
}

var getByQuery = function(searchObject, callback) {
  if (searchObject.hasOwnProperty('any') && searchObject.any != '' && searchObject.any.length > 2) {
    var searchStr = searchObject.any;
    Event.native(function(err, collection) {
      if (err) {
        return responseFormater.fail("Server Error", err, 500);
      }
      collection.find({
        '$or': [
          {
            'bsu_id': {
              '$regex': searchStr,
              '$options': 'i'
            }
          }, {
            'hall': {
              '$regex': searchStr,
              '$options': 'i'
            }
          }, {
            'type': {
              '$regex': searchStr,
              '$options': 'i'
            }
          }, {
            'title': {
              '$regex': searchStr,
              '$options': 'i'
            }
          }, {
            'description': {
              '$regex': searchStr,
              '$options': 'i'
            }
          }
        ]
      }).toArray(function(err, records) {
        callback(responseFormater.success("All events", records));
        return;
      });
    });
  } else {
    callback(responseFormater.fail("Search parameter malformed", {}, 400));
  }
}

var getPendingShiftRequests = function(query, callback){
  console.log(query);
  var pending = query.pending;
  var hall = query.hall;

  var searchObject = {};

  if (pending == "employee") {
    searchObject = {
      '$and': [
        {
          'employee_approved': {}
        }, {
          'hall': hall
          }
      ]
    }
  } else if (pending == "admin") {
    searchObject = {
      '$and': [
        {
          'admin_approved': {}
        }, {
          'employee_approved': {
            $ne: {}
          }
        }, {
          'hall': hall
          }
      ]
    }
  } else {
    callback(responseFormater.fail("Pending parameter malformed", {}, 400));
  }

  ShiftChange.native(function(err, collection) {
    if (err) {
      return responseFormater.fail("Server Error", err, 500);
    }
    collection.find(searchObject).toArray(function(err, records) {
      callback(responseFormater.success("All events", records));
      return;
    });
  });
}

var createEvent = function(requestBody, callback) {
  if (validCreateParams(requestBody)) {
    Event.create({
      bsu_id: requestBody.bsu_id,
      hall: requestBody.hall,
      type: requestBody.type,
      title: requestBody.title,
      description: requestBody.description,
      start_time: requestBody.start_time,
      end_time: requestBody.end_time
    }).exec(function (err, result) {
      if (err) {
        return res.serverError(responseFormater.fail("Server Error", err, 500));
      }

      callback(responseFormater.success("Event added", result, 200));
    });
  } else {
    callback(responseFormater.fail("Invalid create params", null, 404));
    return;
  }
}

var validCreateParams = function(requestBody) {
  if (requestBody.bsu_id && requestBody.hall && requestBody.type && requestBody.title && requestBody.description && requestBody.start_time && requestBody.end_time) {
    return true;
  } else {
    return false
  }
}

var updateEvent = function(id, requestBody, callback) {
  var requestBody = removeEmptyFields(requestBody);
  Event.update({id: id}, requestBody).exec(function (err, result) {
    if (err) {
      return res.serverError(responseFormater.fail("Server Error", err, 500));
    }
    callback(responseFormater.success("Event Updated", result, 200));
  });
}

var removeEmptyFields = function(item) {
  for (var property in item) {
    if (item.hasOwnProperty(property)) {
      if (item[property] == '' || typeof(item[property]) == "undefined" || item[property] == null) {
        delete item[property];
      }
    }
  }
  return item;
}

// TODO: change validation to use promises and refactor validation into seperate funciton

var requestShiftChange = function(requestBody, callback) {
  var requestBody = removeEmptyFields(requestBody);
  if (!validCreateChangeParams(requestBody)) {
    callback(responseFormater.fail("Malformed request data", requestBody, 400));
    return;
  }

  getEventByMongoID(requestBody.event_id_one, function(err, event){
    if (err) {
      callback(responseFormater.fail("Server Error", err, 500));
      return;
    } else if (event.length < 1) {
      callback(responseFormater.fail("Event with id " + requestBody.event_id_one + " not found", requestBody, 404));
      return;
    } else {
      getEventByMongoID(requestBody.event_id_two, function(err, event){
        if (err) {
          callback(responseFormater.fail("Server Error", err, 500));
          return;
        } else if (event.length < 1) {
          callback(responseFormater.fail("Event with id " + requestBody.event_id_two + " not found", requestBody, 404));
          return;
        } else {
          ShiftChange.create(requestBody).exec(function (err, result) {
            if (err) {
              console.log(err);
              callback(responseFormater.fail("Server Error", err, 500));
              return;
            }

            callback(responseFormater.success("Shift Change Request Added", result, 200));
            return;
          });
        }
      });
    }
  });

}

var validCreateChangeParams = function(requestBody) {
  if (requestBody.hall && requestBody.requested_by && requestBody.change_with && requestBody.event_id_one && requestBody.event_id_two) {
    return true;
  } else {
    return false
  }
}

module.exports = {
  "getAllEventsByID": getAllEventsByID,
  "getAllByIDs": getAllByIDs,
  "getByQuery": getByQuery,
  "getAllEventsByHall": getAllEventsByHall,
  "getPendingShiftRequests": getPendingShiftRequests,
  "createEvent": createEvent,
  "updateEvent": updateEvent,
  "requestShiftChange": requestShiftChange
}
