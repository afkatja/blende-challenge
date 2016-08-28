// run test by doing `meteor test --driver-package practicalmeteor:mocha --port 3100`
// as we are testing with mocha during development
// visit localhost:3100 to start tests and see the results
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Tracker } from 'meteor/tracker';
import { faker } from 'faker';

import { Appointments } from '../appointments.js';

// Meteor.methods({
//   'test.resetDatabase': () => resetDatabase(),
// });

//create a dummy component for testing
const withDiv = function withDiv(callback) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  try {
    callback(el);
  } finally {
    document.body.removeChild(el);
  }
};

const withRenderedTemplate = function withRenderedTemplate(template, data, callback) {
  withDiv((el) => {
    Blaze.renderWithData(template, data, el);
    Tracker.flush();
    callback(el);
  });
};

Factory.define('appointments', Appointments, {});

describe('appointments app', function (done) {
  // beforeEach(function (done) {
  //   Meteor.call('test.resetDatabase', done);
  // });
  it('should display working hours', function () {
    const data = Factory.build('appointments', {});

    withRenderedTemplate('calendar', data, el => {
      expect(el.querySelectorAll('.collection-item')).to.have.length(11);
    });
  });
})
