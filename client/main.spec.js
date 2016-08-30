// run test by doing `meteor test --driver-package practicalmeteor:mocha --port 3100`
// as we are testing with mocha during development
// visit localhost:3100 to start tests and see the results
import { chai, expect } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/templating';

import './main.html';
import './main.js';
import { Appointments } from '../appointments.js';

describe('appointments app', function () {
  it('should display today date', function(){
    let today = new Date();
    expect(document.body.querySelector('.collection-header h2').innerText).to.equal('30 august 2016');
  });
  it('should display working hours', function () {
    expect(document.body.querySelectorAll('.collection-item')).to.have.length(11);
  });
  it('should render appointment in the calendar', function(){
    expect(document.body.querySelectorAll('.appointment')).to.have.length(Appointments.find().count());
  });
})
