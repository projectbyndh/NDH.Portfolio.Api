const { Course, Batch } = require('../models');

// Get all courses (Public)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            order: [['isFeatured', 'DESC'], ['title', 'ASC']],
            include: [{
                model: Batch,
                as: 'batches',
                where: { status: 'upcoming' },
                required: false, // Include courses even if no batches
                attributes: ['startDate', 'status', 'mode', 'fee']
            }]
        });

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get single course by slug (Public)
exports.getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const course = await Course.findOne({
            where: { slug },
            include: [{
                model: Batch,
                as: 'batches',
                where: { status: ['upcoming', 'ongoing', 'filling fast'] },
                required: false,
                order: [['startDate', 'ASC']]
            }]
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Create Course (Admin)
exports.createCourse = async (req, res) => {
    try {
        const courseData = req.body;

        // Parse JSON fields if they come as strings (e.g. from FormData)
        ['instructorLinks', 'whatYouWillLearn', 'syllabus', 'outcomes', 'prerequisites', 'targetAudience', 'faqs'].forEach(field => {
            if (typeof courseData[field] === 'string') {
                try {
                    courseData[field] = JSON.parse(courseData[field]);
                } catch (e) {
                    // Keep as is if parse fails, validation might catch it later
                }
            }
        });

        // Check slug uniqueness
        const existing = await Course.findOne({ where: { slug: courseData.slug } });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Course with this slug already exists'
            });
        }

        const course = await Course.create(courseData);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Update Course (Admin)
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const updateData = req.body;

        // Parse JSON fields
        ['instructorLinks', 'whatYouWillLearn', 'syllabus', 'outcomes', 'prerequisites', 'targetAudience', 'faqs'].forEach(field => {
            if (typeof updateData[field] === 'string') {
                try {
                    updateData[field] = JSON.parse(updateData[field]);
                } catch (e) {
                    // Ignore
                }
            }
        });

        await course.update(updateData);

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete Course (Admin)
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await course.destroy();

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
