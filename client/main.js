import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

import { Appointments } from '../appointments.js';

const hoursArray = range(6, 11);

Template.calendar.helpers({
  today() {
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${day} ${months[month]} ${year}`;
  },
  hours(){
    let hrs = [];
    for (var i = 0; i < hoursArray.length; i++) {
      let hr = 7 + i; //begin at 07:00
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

function interpolateTimeToPosition(from, to) {
  const start = parseFloat(from),
        end = parseFloat(to);
  let hour = 80; //height of each .collection-item
  let top = 140; //offsetTop of the first .collection-item
  if(inRange(start, end, hoursArray)) {
    let closestStart = hoursArray.reduce( (prev, curr) => {
      return (Math.abs(curr - start) < Math.abs(prev - start) ? curr : prev);
    });
    let closestEnd = hoursArray.reduce( (prev, curr) => {
      return (Math.abs(curr - end) < Math.abs(prev - end) ? curr : prev);
    });
    let halfHourStart = start - closestStart > 0;
    let posTop = top + hour * hoursArray.indexOf(closestStart) + (halfHourStart ? hour/2 : 0);
    let height = hour * (hoursArray.indexOf(closestEnd) - hoursArray.indexOf(closestStart));
    return {
      top: posTop,
      height: height
    };
  }
}

function inRange(min, max, range) {
  return range[0] <= min && range[range.length - 1] >= max;
}

function range(start, count) {
  return Array.apply(null, Array(count)).map((_, index) => index + start);
}

Template.calendar.events({
  'click'(event, instance) {
    //TODO get mouse position
    //TODO calculate what time mapped based on position
    //TODO display new appointment with min duration of 30 min
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
  overlapping(){
    if(Appointments.find({from: this.from}).fetch().length) {
      return 'overlapping';
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
