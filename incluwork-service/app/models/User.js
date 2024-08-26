import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'mongoose-type-email';

let schema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["employer", "jobseeker","admin"],
      required: true,
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          // Remove any non-numeric characters
          const numericValue = v.replace(/\D/g, '');
          // Check if the numeric value contains exactly 10 digits
          return numericValue.length === 10;
        },
        msg: "Phone number must contain exactly 10 digits!",
      }
    },
  },
  { collation: { locale: "en" } ,
  versionKey:false}
);

// Password hashing
schema.pre("save", function (next) {
  let user = this;

  // if the data is not modified
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Password verification upon login
schema.methods.login = function (password) {
  let user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const User = mongoose.model("User", schema);
export default User;
