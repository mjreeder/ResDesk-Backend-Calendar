'use strict';

var util = require('util');
var calendarService = require('../services/CalendarService.js');

function getEventsByBSUId(req, res){
  calendarService.getAllEventsByID(req.swagger.params.bsu_id.value, function(response){
    res.status(response.status).json(response);
  });
}

function getAllEventsByBSUIDs(req, res) {
  calendarService.getAllByIDs(req.body, function(response) {
    res.status(response.status).json(response);
  });
}

function getEventsBySearch(req, res){
  calendarService.getByQuery(req.query, function(response){
    res.status(response.status).json(response);
  });
}

function getEventsByHall(req, res){
  calendarService.getAllEventsByHall(req.swagger.params.hall.value, function(response){
    res.status(response.status).json(response);
  });
}

function getPendingShiftRequests(req, res){
  calendarService.getPendingShiftRequests(req.query, function(response){
    res.status(response.status).json(response);
  });
}

function createEvent(req, res){
  var body = {
    'bsu_id': req.swagger.params.eventObj.value.bsu_id,
    'hall': req.swagger.params.eventObj.value.hall,
    'type': req.swagger.params.eventObj.value.type,
    'title': req.swagger.params.eventObj.value.title,
    'description': req.swagger.params.eventObj.value.description,
    'start_time': req.swagger.params.eventObj.value.start_time,
    'end_time': req.swagger.params.eventObj.value.end_time
  };
  calendarService.createEvent(body, function(response) {
    res.status(response.status).json(response);
  });
}

function updateEvent(req, res){
  var id = req.swagger.params.updateEventObj.value.id || "";
  var body = {
    'bsu_id': req.swagger.params.updateEventObj.value.bsu_id,
    'hall': req.swagger.params.eventObj.value.hall,
    'type': req.swagger.params.updateEventObj.value.type,
    'title': req.swagger.params.updateEventObj.value.title,
    'description': req.swagger.params.updateEventObj.value.description,
    'start_time': req.swagger.params.updateEventObj.value.start_time,
    'end_time': req.swagger.params.updateEventObj.value.end_time
  };
  calendarService.updateEvent(id, body, function(response) {
    res.status(response.status).json(response);
  });
}

function requestShiftChange(req, res) {
  var body = {
    'hall': req.swagger.params.changeObj.value.hall,
    'requested_by': req.swagger.params.changeObj.value.requested_by,
    'change_with': req.swagger.params.changeObj.value.change_with,
    'event_id_one': req.swagger.params.changeObj.value.event_id_one,
    'event_id_two': req.swagger.params.changeObj.value.event_id_two,
    'employee_approved': {},
    'admin_approved': {}
  };
  calendarService.requestShiftChange(body, function(response){
    res.status(response.status).json(response);
  });
}

module.exports = {
  getEventsByBSUId: getEventsByBSUId,
  getAllEventsByBSUIDs: getAllEventsByBSUIDs,
  getEventsBySearch: getEventsBySearch,
  getEventsByHall: getEventsByHall,
  getPendingShiftRequests: getPendingShiftRequests,
  createEvent: createEvent,
  updateEvent: updateEvent,
  requestShiftChange: requestShiftChange
};
