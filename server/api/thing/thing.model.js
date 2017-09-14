'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './thing.events';

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  authorContact: String,
  authorName: String,
  complexity: String,
  formToShow: String,
  message: String,
  selectedJobType: Number
});

registerEvents(ThingSchema);
export default mongoose.model('Thing', ThingSchema);
