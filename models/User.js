const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now, 
    },
    updated_at: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true } 
);

// Pre-save middleware to hash password before saving to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
