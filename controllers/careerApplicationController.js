const CareerApplication = require('../models/CareerApplication');
const Career = require('../models/Career');
const ExcelJS = require('exceljs');
const { sendApplicationNotification } = require('../services/emailService');

// Get all applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await CareerApplication.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single application
exports.getApplicationById = async (req, res) => {
    try {
        const application = await CareerApplication.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create application (with CV upload)
exports.createApplication = async (req, res) => {
    try {
        console.log('📝 Creating career application');
        console.log('📁 req.file:', req.file);
        console.log('📄 req.body:', req.body);

        // Handle CV upload
        if (req.file) {
            req.body.cvUrl = req.file.path; // Cloudinary URL
        }

        // Get career title
        if (req.body.careerId) {
            const career = await Career.findByPk(req.body.careerId);
            if (career) {
                req.body.careerTitle = career.title;
            }
        }

        const application = await CareerApplication.create(req.body);

        // Send email notification asynchronously
        sendApplicationNotification(application).catch(err => console.error('Email notification failed:', err));

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        console.error('❌ Application creation error:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const application = await CareerApplication.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await application.update({ status: req.body.status });

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: application
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update application status',
            error: error.message
        });
    }
};

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await CareerApplication.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await application.destroy();

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Export applications to Excel
exports.exportToExcel = async (req, res) => {
    try {
        const applications = await CareerApplication.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Career Applications');

        // Define columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Full Name', key: 'fullName', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Position Applied', key: 'careerTitle', width: 30 },
            { header: 'CV Link', key: 'cvUrl', width: 50 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Applied Date', key: 'createdAt', width: 20 }
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF084281' }
        };
        worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

        // Add data rows
        applications.forEach(app => {
            worksheet.addRow({
                id: app.id,
                fullName: app.fullName,
                email: app.email,
                phone: app.phone,
                careerTitle: app.careerTitle,
                cvUrl: app.cvUrl,
                status: app.status,
                createdAt: new Date(app.createdAt).toLocaleString()
            });
        });

        // Make CV URLs clickable
        worksheet.getColumn('cvUrl').eachCell((cell, rowNumber) => {
            if (rowNumber > 1 && cell.value) {
                cell.value = {
                    text: 'View CV',
                    hyperlink: cell.value
                };
                cell.font = { color: { argb: 'FF26A8DF' }, underline: true };
            }
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=career-applications-${Date.now()}.xlsx`
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('❌ Excel export error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export applications',
            error: error.message
        });
    }
};
