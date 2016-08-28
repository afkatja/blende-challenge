import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

import { Appointments } from '../appointments.js';

Template.calendar.onCreated(function() {
});

Template.calendar.helpers({
  today() {
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${day} ${months[month]} ${year}`;
  },
  hours(){
    let hrs = [];
    for (var i = 7; i < 18; i++) {
      let hr = i;
      if(hr < 10){
        hr = '0' + hr;
      }
      hrs.push(hr + ':00');
    }
    return hrs;
  },
  appointments(){
    let arr = Appointments.find().fetch();
    return arr;
  }
});

const hoursArray = range(6, 11);
function interpolateTimeToPosition(from, to) {
  const start = parseInt(from),
        end = parseInt(to);
  let hour = 80; //height of each .collection-item
  let top = 140; //offsetTop of the first .collection-item
  if(hoursArray.includes(start) && hoursArray.includes(end)) {
    let posTop = top + hour * hoursArray.indexOf(start);
    let height = hour * (hoursArray.indexOf(end) - hoursArray.indexOf(start));
    return {
      top: posTop,
      height: height
    };
  }
}

function range(start, count) {
  return Array.apply(null, Array(count))
    .map((_, index) => {
      return index + start;
  });
}

Template.calendar.events({
  'click'(event, instance) {
    //get mouse position
    //calculate what time mapped based on position
    //display new appointment with min duration of 30 min
  }
});

Template.appointment.events({
  'click .remove-appointment'(event){
    Appointments.remove(this._id);
  }
});

Template.appointment.helpers({
  position(){
    return interpolateTimeToPosition(this.from, this.to);
  },
  overlaying(){
    if(Appointments.find({from: this.from}).fetch().length) {
      return 'overlaying';
    }
  }
});

Template.details.events({
  'submit .details-form'(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let pairs = {};
    for (let pair of formData.entries()) {
      pairs[pair[0]] = pair[1];
    }
    Appointments.insert({
      name: pairs['appointment-title'],
      from: pairs['appointment-start'],
      to: pairs['appointment-end'],
      descr: pairs['descr']
    });
    event.target.reset(); //clear inputs
  }
});
