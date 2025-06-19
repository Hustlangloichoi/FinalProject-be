const Order = require("../models/order");
const Product = require("../models/product");
const { sendResponse } = require("../helpers/utils");

exports.getAllOrders = async (req, res) => {
  try {
    const { user, product, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (user) filter.sender = user;
    if (product) filter.product = product;
    const orders = await Order.find(filter)
      .populate("sender", "name email")
      .populate("product", "name price image")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    sendResponse(
      res,
      200,
      true,
      { orders, total, page, totalPages: Math.ceil(total / limit) },
      null,
      "Orders retrieved successfully"
    );
  } catch (error) {
    sendResponse(res, 500, false, null, error, "No order was found");
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("sender", "name email")
      .populate("product", "name price image");

    if (!order) {
      return sendResponse(res, 404, false, null, null, "no order was found");
    }

    sendResponse(res, 200, true, order, null, "Order retrieved successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, error, "cannot load order");
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      note,
      quantity,
      paymentMethod,
      paymentDetails,
      phoneNumber,
      address,
    } = req.body;
    const userId = req.user.id;

    console.log("Request payload:", JSON.stringify(req.body, null, 2));
    if (!quantity || !paymentMethod || !phoneNumber || !address) {
      return sendResponse(
        res,
        400,
        false,
        null,
        null,
        "Order's quantity, payment method, phone number, and address are required"
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, null, null, "No product was found");
    }

    const totalPrice = product.price * quantity; // Calculate total price

    const newOrder = new Order({
      product: productId,
      sender: userId,
      note,
      quantity,
      totalPrice,
      paymentMethod,
      paymentDetails,
      phoneNumber,
      address,
    });

    await newOrder.save();
    sendResponse(res, 201, true, newOrder, null, "Order created successfully");
  } catch (error) {
    console.log("Error details:", error);
    sendResponse(res, 500, false, null, error, "Cannot send order");
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get the user ID from the authenticated request

    const order = await Order.findById(id);

    if (!order) {
      return sendResponse(res, 404, false, null, null, "No order was found");
    }

    // Check if the order belongs to the authenticated user
    if (order.sender.toString() !== userId) {
      return sendResponse(
        res,
        403,
        false,
        null,
        null,
        "You are not authorized to delete this order"
      );
    }

    await order.deleteOne(); // Delete the order

    sendResponse(res, 200, true, null, null, "Order deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, error, "cannot delete order");
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Validate status
    const validStatuses = ["pending", "completed"];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return sendResponse(
        res,
        400,
        false,
        null,
        null,
        "Invalid status. Valid statuses are: pending, completed"
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return sendResponse(res, 404, false, null, null, "No order was found");
    }

    // Update the order status
    order.status = status.toLowerCase();
    await order.save();

    // Return the updated order with populated fields
    const updatedOrder = await Order.findById(id)
      .populate("sender", "name email")
      .populate("product", "name price image");

    sendResponse(
      res,
      200,
      true,
      updatedOrder,
      null,
      "Order status updated successfully"
    );
  } catch (error) {
    sendResponse(res, 500, false, null, error, "Cannot update order status");
  }
};
