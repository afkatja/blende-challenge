import { Meteor } from 'meteor/meteor';
import {Appointments} from '../appointments.js'

Meteor.startup(() => {
  Appointments.remove({});
});
