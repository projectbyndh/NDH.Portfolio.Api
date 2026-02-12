const Testimonial = require('../models/Testimonial');

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
    try {
        const { featured, active } = req.query;

        let where = {};
        if (featured === 'true') where.featured = true;
        if (active === 'true') where.isActive = true;

        const testimonials = await Testimonial.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single testimonial
exports.getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
    try {
        // Handle image upload
        if (req.file) {
            req.body.image = req.file.path;
        }

        const testimonial = await Testimonial.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Testimonial created successfully',
            data: testimonial
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to create testimonial',
            error: error.message
        });
    }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        // Handle image upload
        if (req.file) {
            req.body.image = req.file.path;
        }

        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        await testimonial.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Testimonial updated successfully',
            data: testimonial
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update testimonial',
            error: error.message
        });
    }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        await testimonial.destroy();

        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        testimonial.featured = !testimonial.featured;
        await testimonial.save();

        res.status(200).json({
            success: true,
            message: `Testimonial ${testimonial.featured ? 'featured' : 'unfeatured'} successfully`,
            data: testimonial
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
