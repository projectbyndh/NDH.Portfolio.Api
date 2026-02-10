const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.name === 'SequelizeUniqueConstraintError' ? 'Category already exists' : 'Failed to create category',
            error: error.message
        });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        await category.update(req.body);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update category',
            error: error.message
        });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        await category.destroy();
        res.status(200).json({
            success: true,
            message: 'Category deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
