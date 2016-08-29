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
Template.calendar.onCreated(function() {
  if(!Appointments.find().count()) {
    //prefill the calendar with static data first time on load
    Appointments.insert({
      name: 'Sprint retrospective',
      from: 9.5,
      to: 10.5,
      descr: 'Lorem ipsum doler sit amet...'
    });

    Appointments.insert({
      name: 'Database migration',
      from: 13,
      to: 15,
      descr: 'Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they\'re actually proud of that shit.'
    });

    Appointments.insert({
      name: 'All hands',
      from: 14,
      to: 15,
      descr: 'Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I\'m in a transitional period so I don\'t wanna kill you, I wanna help you. But I can\'t give you this case, it don\'t belong to me. Besides, I\'ve already been through too much shit this morning over this case to hand it over to your dumb ass.'
    });
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
