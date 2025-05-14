const Category = require("../models/category");
const { sendResponse } = require("../helpers/utils");

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 12, keyword = "" } = req.query;
    const filter = {};
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }
    const categories = await Category.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Category.countDocuments(filter);
    sendResponse(
      res,
      200,
      true,
      {
        category: categories,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
      null,
      null
    );
  } catch (error) {
    sendResponse(res, 500, false, null, "Server Error", error);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = new Category({ name, description });
    await newCategory.save();

    sendResponse(res, 201, true, newCategory, null, null);
  } catch (error) {
    sendResponse(res, 500, false, null, "cannot create category", error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return sendResponse(res, 404, false, null, "no category was found", null);
    }

    sendResponse(res, 200, true, category, null, null);
  } catch (error) {
    sendResponse(res, 500, false, null, "cannot udpate category", error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return sendResponse(res, 404, false, null, "no category was found", null);
    }

    sendResponse(
      res,
      200,
      true,
      deletedCategory,
      "delete category successfully",
      null
    );
  } catch (error) {
    sendResponse(res, 500, false, null, "cannot delete category", error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
