import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

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
  }
});

Template.calendar.events({
  'click button'(event, instance) {
  }
});
