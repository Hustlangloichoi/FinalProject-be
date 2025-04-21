const Category = require("../models/category.model");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    //nên có pagination
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "cannot create category", error });
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
      return res.status(404).json({ message: "no category was found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "cannot udpate category", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "no category was found" });
    }

    res
      .status(200)
      .json({ message: "delete category successfully", deletedCategory });
  } catch (error) {
    res.status(500).json({ message: "cannot delete category", error });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
