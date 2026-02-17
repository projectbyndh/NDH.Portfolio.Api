const { Batch, Course } = require('../models');

// Get all batches for a course (Public)
exports.getBatchesByCourse = async (req, res) => {
    try {
        const { courseId } = req.query;

        // If no courseId, maybe return all batches? Or just upcoming ones?
        const where = {};
        if (courseId) where.courseId = courseId;

        // By default, public should see upcoming/ongoing batches
        if (!req.user) { // Assuming protect middleware populates req.user
            where.status = ['upcoming', 'ongoing', 'filling fast'];
        }

        const batches = await Batch.findAll({
            where,
            order: [['startDate', 'ASC']],
            include: [{
                model: Course,
                as: 'course',
                attributes: ['title', 'slug']
            }]
        });

        res.status(200).json({
            success: true,
            data: batches
        });
    } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Create Batch (Admin)
exports.createBatch = async (req, res) => {
    try {
        const batchData = req.body;

        const batch = await Batch.create(batchData);

        res.status(201).json({
            success: true,
            data: batch
        });
    } catch (error) {
        console.error('Error creating batch:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Update Batch (Admin)
exports.updateBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const batch = await Batch.findByPk(id);

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        await batch.update(req.body);

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        console.error('Error updating batch:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete Batch (Admin)
exports.deleteBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const batch = await Batch.findByPk(id);

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        await batch.destroy();

        res.status(200).json({
            success: true,
            message: 'Batch deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting batch:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
