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
      .populate("product", "name")
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
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return sendResponse(
        res,
        400,
        false,
        null,
        null,
        "order's content is required"
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, null, null, "no product was found");
    }

    const newOrder = new Order({
      product: productId,
      sender: userId,
      content,
    });

    await newOrder.save();
    sendResponse(res, 201, true, newOrder, null, "Order created successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, error, "cannot send order");
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return sendResponse(res, 404, false, null, null, "no order was found");
    }

    sendResponse(
      res,
      200,
      true,
      deletedOrder,
      null,
      "delete order successfully"
    );
  } catch (error) {
    sendResponse(res, 500, false, null, error, "cannot delete order");
  }
};
