const { Enrollment, Course, Batch } = require('../models');

// Create Enrollment (Public)
exports.createEnrollment = async (req, res) => {
    try {
        const enrollmentData = req.body;

        // Check if duplicate?
        // Usually allow, or check email+course combination

        const enrollment = await Enrollment.create(enrollmentData);

        res.status(201).json({
            success: true,
            message: 'Enrollment submitted successfully. We will contact you soon.',
            data: enrollment
        });
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get All Enrollments (Admin)
exports.getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: Course,
                as: 'course',
                attributes: ['title']
            }, {
                model: Batch,
                as: 'batch',
                attributes: ['name', 'startDate']
            }]
        });

        res.status(200).json({
            success: true,
            data: enrollments
        });
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Update Enrollment Status (Admin)
exports.updateEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const enrollment = await Enrollment.findByPk(id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        if (status) enrollment.status = status;
        if (notes !== undefined) enrollment.notes = notes;
        if (status === 'contacted' && !enrollment.contactedAt) enrollment.contactedAt = new Date();
        if (status === 'enrolled' && !enrollment.enrolledAt) enrollment.enrolledAt = new Date();

        await enrollment.save();

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        console.error('Error updating enrollment:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
