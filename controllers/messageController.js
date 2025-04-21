const Message = require("../models/message.model");
const Product = require("../models/product.model");

exports.getAllMessages = async (req, res) => {
  try {
    const { user, product } = req.query;

    const filter = {};

    if (user) filter.sender = user;
    if (product) filter.product = product;

    const messages = await Message.find(filter)
      .populate("sender", "name email")
      .populate("product", "name");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "no message was found", error });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id)
      .populate("sender", "name email")
      .populate("product", "name");

    if (!message) {
      return res.status(404).json({ message: "no message was found" });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "cannot load massage", error });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "message's content is require" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "no product was found" });
    }

    const newMessage = new Message({
      product: productId,
      sender: userId,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "cannot send message", error });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "no message was found" });
    }

    res.json({ message: "delete message successfully", deletedMessage });
  } catch (error) {
    res.status(500).json({ message: "cannot delete message", error });
  }
};
