const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {

  const frontend_url = "https://food-del-app-frontend.netlify.app";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.orderData.items,
      amount: req.body.orderData.amount,
      address: req.body.orderData.address,
    });
      await newOrder.save()
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
      
      const line_items = req.body.orderData.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100 * 80,
        },
        quantity: item.quantity,
      }));
      line_items.push({
          price_data: {
              currency: "inr",
              product_data: {
                  name:"Delivery Charges"
              },
              unit_amount:2*100*80
          },
          quantity:1
      })
    console.log('Stripe amount payment')
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });

      res.json({success:true,session_url:session.url})
  } catch (error) {
      console.log(error.message)
      res.json({success:false,message:"Error"})
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body
  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true })
      res.json({success:true,message:"Paid"})
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({success:false,message:"Not paid"})
    }
  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:"Error"})
  }
}

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId })
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:"Error"})
  }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
      const orders = await orderModel.find({})
      res.json({success:true,data:orders})
    } catch (err) {
      console.log(err.message)
      res.json({success:false,message:"Error"})
    } 
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
      await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
      res.json({success:true,message:"Status Updated"})
    } catch (err) {
      console.log(err.message)
      res.json({ success: false, message: "Error" });
    }
}

module.exports = {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};
