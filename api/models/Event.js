/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    bsu_id:{
      type: 'string'
    },
    hall:{
      type: 'string'
    },
    type:{
      type: 'string',
      enum: ['work', 'school', 'personal']
    },
    title:{
      type: 'string'
    },
    description:{
      type: 'string'
    },
    start_time:{
      type: 'date'
    },
    end_time:{
      type: 'date'
    }
  }
};
