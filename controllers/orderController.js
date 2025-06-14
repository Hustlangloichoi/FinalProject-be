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
      .populate("product", "name") // Revert to only including name field in product population
      .select("quantity address phoneNumber paymentMethod note totalPrice createdAt")
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
      .populate("product", "name");

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
    const { quantity, address, phoneNumber, paymentMethod, note } = req.body;
    const userId = req.user.id;

    if (!quantity || !address || !phoneNumber || !paymentMethod) {
      return sendResponse(
        res,
        400,
        false,
        null,
        null,
        "Missing required fields: quantity, address, phoneNumber, or paymentMethod"
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, null, null, "No product was found");
    }

    const newOrder = new Order({
      product: productId,
      sender: userId,
      quantity,
      address,
      phoneNumber,
      paymentMethod,
      note,
    });

    await newOrder.save();
    sendResponse(res, 201, true, newOrder, null, "Order created successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, error, "Cannot create order");
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
