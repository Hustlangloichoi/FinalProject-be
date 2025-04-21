const Category = require("../models/category.model");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category is required" });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "cannot create category", error });
  }
};

exports.updateCategory = async (req, res) => {
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

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "cannot udpate category", error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "no category was found" });
    }

    res.json({ message: "delete category successfully", deletedCategory });
  } catch (error) {
    res.status(500).json({ message: "cannot delete category", error });
  }
};
