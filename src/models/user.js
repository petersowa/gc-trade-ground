const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    value: {
      type: String,
      require: false,
    },
    expiration: {
      type: Date,
      require: false,
    },
  },
});

// userSchema.methods.addToCart = function(product) {
//   const index = this.cart.items.findIndex(
//     i => i.productRef.toString() === product
//   );

//   if (index >= 0) {
//     this.cart.items[index].quantity++;
//   } else {
//     this.cart.items.push({ productRef: product, quantity: 1 });
//   }

//   return this.save();
// };

// userSchema.methods.getCart = async function() {
//   const user = await this.populate('cart.items.productRef').execPopulate();

//   return user.cart.items;
// };

// userSchema.methods.clearCart = async function() {
//   this.cart.items = [];
//   return this.save();
// };

// userSchema.methods.submitOrder = async function() {
//   new Order({
//     userRef: this._id,
//     items: [...this.cart.items],
//   }).save();
//   this.cart.items = [];
//   return this.save();
// };

module.exports = mongoose.model('User', userSchema);
