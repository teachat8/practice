const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: { unqie: true, type: Number, isRequire: true },

  mobile: { unqie: true, type: String },
  password: { type: String, isRequire: true },
  
  nickname: { unqie: true, type: String, isRequire: true },
  avatar: { type: String },
  location: { type: String },
  signature: { type: String },

  score: { type: Number, default: 0 },
  is_start: { type: Boolean, default: false },
  collect_list: { type: Array, default: [] },
  reply_list: { type: Array, default: [] },
  follower_list: { type: Array, default: [] },
  following_list: { type: Array, default: [] },

  is_admin: { type: Boolean, default: false },
  role: { type: Number, default: 0 },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

UserSchema.index({ id: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;