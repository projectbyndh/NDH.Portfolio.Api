const ServiceDetail = require('../models/ServiceDetail');
const Service = require('../models/Service');

/**
 * Helper: parse a value that may arrive as a JSON string, comma-separated
 * string, or already as an array.  Returns a clean JS array.
 */
const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        // Try JSON first (["a","b"])
        if (trimmed.startsWith('[')) {
            try { return JSON.parse(trimmed); } catch (_) { }
        }
        // Fall back to comma-separated
        return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
};

// ---------------------------------------------------------------------------
// GET /api/service-details
// Returns all service-detail records. Useful for admin dashboards.
// ---------------------------------------------------------------------------
exports.getAllServiceDetails = async (req, res) => {
    try {
        const details = await ServiceDetail.findAll({
            include: [
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'title', 'description'] // return only lightweight service fields
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: details.length,
            data: details
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// ---------------------------------------------------------------------------
// GET /api/service-details/:id
// Returns a single ServiceDetail by its own primary key.
// ---------------------------------------------------------------------------
exports.getServiceDetailById = async (req, res) => {
    try {
        const detail = await ServiceDetail.findByPk(req.params.id, {
            include: [
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'title', 'description', 'logo', 'tagline', 'capabilities']
                }
            ]
        });

        if (!detail) {
            return res.status(404).json({
                success: false,
                message: 'Service detail not found'
            });
        }

        res.status(200).json({
            success: true,
            data: detail
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// ---------------------------------------------------------------------------
// POST /api/service-details
// Create a new ServiceDetail record.
// REQUIREMENT: The referenced serviceId must point to an existing Service.
// ---------------------------------------------------------------------------
exports.createServiceDetail = async (req, res) => {
    try {
        const { serviceId, details, expertise, features, tools, portfolioLink } = req.body;

        // --- Validate required fields ---
        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: 'serviceId is required'
            });
        }
        if (!details || String(details).trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'details field is required'
            });
        }

        // --- FK Integrity: ensure the parent Service exists ---
        const parentService = await Service.findByPk(serviceId);
        if (!parentService) {
            return res.status(404).json({
                success: false,
                message: `Service with id '${serviceId}' does not exist. Cannot create ServiceDetail without a valid parent Service.`
            });
        }

        // --- Prevent duplicate: a Service can only have ONE detail record ---
        const existingDetail = await ServiceDetail.findOne({ where: { serviceId } });
        if (existingDetail) {
            return res.status(409).json({
                success: false,
                message: `A ServiceDetail for serviceId '${serviceId}' already exists. Use PUT /api/service-details/${existingDetail.id} to update it.`,
                existingId: existingDetail.id
            });
        }

        // --- Normalise array fields (accept string, JSON array, or JS array) ---
        const payload = {
            serviceId,
            details,
            expertise: parseArray(expertise),
            features: parseArray(features),
            tools: parseArray(tools),
            portfolioLink: portfolioLink || null
        };

        const newDetail = await ServiceDetail.create(payload);

        res.status(201).json({
            success: true,
            message: 'Service detail created successfully',
            data: newDetail
        });
    } catch (error) {
        // Sequelize validation errors (e.g. invalid URL for portfolioLink)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map(e => ({ field: e.path, message: e.message }))
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create service detail',
            error: error.message
        });
    }
};

// ---------------------------------------------------------------------------
// PUT /api/service-details/:id
// Update an existing ServiceDetail by its primary key.
// Changing serviceId is allowed only if the new serviceId exists.
// ---------------------------------------------------------------------------
exports.updateServiceDetail = async (req, res) => {
    try {
        // Locate the existing record
        const detail = await ServiceDetail.findByPk(req.params.id);
        if (!detail) {
            return res.status(404).json({
                success: false,
                message: 'Service detail not found'
            });
        }

        const { serviceId, details, expertise, features, tools, portfolioLink } = req.body;

        // --- If serviceId is being changed, verify the new parent exists ---
        if (serviceId && Number(serviceId) !== detail.serviceId) {
            const newParent = await Service.findByPk(serviceId);
            if (!newParent) {
                return res.status(404).json({
                    success: false,
                    message: `Cannot reassign: Service with id '${serviceId}' does not exist.`
                });
            }
        }

        // Build the update payload — only include fields that were sent
        const updatePayload = {};
        if (serviceId !== undefined) updatePayload.serviceId = serviceId;
        if (details !== undefined) updatePayload.details = details;
        if (expertise !== undefined) updatePayload.expertise = parseArray(expertise);
        if (features !== undefined) updatePayload.features = parseArray(features);
        if (tools !== undefined) updatePayload.tools = parseArray(tools);
        if (portfolioLink !== undefined) updatePayload.portfolioLink = portfolioLink || null;

        await detail.update(updatePayload);

        res.status(200).json({
            success: true,
            message: 'Service detail updated successfully',
            data: detail
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map(e => ({ field: e.path, message: e.message }))
            });
        }
        res.status(400).json({
            success: false,
            message: 'Failed to update service detail',
            error: error.message
        });
    }
};

// ---------------------------------------------------------------------------
// DELETE /api/service-details/:id
// Delete a single ServiceDetail record by its primary key.
// The parent Service is NOT affected.
// ---------------------------------------------------------------------------
exports.deleteServiceDetail = async (req, res) => {
    try {
        const detail = await ServiceDetail.findByPk(req.params.id);

        if (!detail) {
            return res.status(404).json({
                success: false,
                message: 'Service detail not found'
            });
        }

        await detail.destroy();

        res.status(200).json({
            success: true,
            message: 'Service detail deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
