/**
 * ShiftChange.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    hall: {
      type: 'string'
    },
    requested_by: {
      type: 'string'
    },
    change_with: {
      type: 'string'
    },
    event_id_one:{
      type: 'string'
    },
    event_id_two:{
      type: 'string',
    },
    employee_approved:{
      type: 'object'
    },
    admin_approved:{
      type: 'object'
    }
  }
};
