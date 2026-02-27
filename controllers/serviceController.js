const { Op } = require('sequelize');
const Service = require('../models/Service');
const ServiceDetail = require('../models/ServiceDetail');
const { sequelize } = require('../config/database');

/**
 * Helper: parse a value that may arrive as a JSON string, comma-separated
 * string, or already as an array. Returns a clean JS array.
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
// GET /api/services
// Returns all services with optional pagination.
// Query params:
//   page  (default 1)  — page number
//   limit (default 0)  — records per page; 0 = return all
// Each item includes id, title, and description aliased as shortDesc so the
// response matches the agreed contract without altering the DB column name.
// ---------------------------------------------------------------------------
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: ['id', 'title', 'logo', ['description', 'shortDesc'], 'tagline', 'capabilities', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
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
// GET /api/services/lite
// Returns a lightweight list of all services (id and title only).
// Ideal for population dropdowns/selectors in the frontend.
// ---------------------------------------------------------------------------
exports.getServicesLite = async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: ['id', 'title'],
      order: [['title', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: services
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
// GET /api/services/:id
// Returns a single service by its primary key (id).
// ---------------------------------------------------------------------------
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
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
// GET /api/services/:id/details
// Returns full details for a service by its id OR by its title (slug-style).
// The `:id` param is checked first as a numeric PK; if NaN it is treated as a
// title to support URL-friendly lookups like /api/services/web-development/details.
// ---------------------------------------------------------------------------
exports.getServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    // Build the WHERE clause: numeric → match by PK, otherwise by title
    const whereClause = !isNaN(numericId)
      ? { id: numericId }
      : { title: { [Op.iLike]: id.replace(/-/g, ' ') } }; // dash → space for slug support

    // Fetch the service and eagerly load its detail via the association
    const service = await Service.findOne({
      where: whereClause,
      include: [
        {
          model: ServiceDetail,
          as: 'detail'
        }
      ]
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.detail) {
      return res.status(404).json({
        success: false,
        message: `No detail record found for service '${service.title}'. Use POST /api/service-details to create one.`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        // Merge service fields + detail fields into one flat response
        id: service.id,
        title: service.title,
        shortDesc: service.description, // alias
        logo: service.logo,
        tagline: service.tagline,
        capabilities: service.capabilities,
        details: service.detail.details,
        expertise: service.detail.expertise,
        features: service.detail.features,
        tools: service.detail.tools,
        portfolioLink: service.detail.portfolioLink,
        detailId: service.detail.id
      }
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
// POST /api/services/create
// Creates a new service. Handles optional logo upload and capabilities array.
// ---------------------------------------------------------------------------
exports.createService = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Handle logo upload
    if (req.file) {
      req.body.logo = req.file.path;
    }

    // Normalise capabilities
    if (req.body.capabilities) {
      req.body.capabilities = parseArray(req.body.capabilities);
    }

    // Extract detail fields from request body
    const {
      details,
      expertise,
      features,
      tools,
      portfolioLink,
      ...serviceData
    } = req.body;

    // Create the parent Service
    const service = await Service.create(serviceData, { transaction });

    // If detail information is provided, create the child ServiceDetail
    if (details) {
      await ServiceDetail.create({
        serviceId: service.id,
        details,
        expertise: parseArray(expertise),
        features: parseArray(features),
        tools: parseArray(tools),
        portfolioLink: portfolioLink || null
      }, { transaction });
    }

    await transaction.commit();

    // Fetch the created service with its detail for the response
    const createdService = await Service.findByPk(service.id, {
      include: [{ model: ServiceDetail, as: 'detail' }]
    });

    res.status(201).json({
      success: true,
      message: 'Service and details created successfully',
      data: createdService
    });
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    res.status(400).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------------------
// PUT /api/services/:id
// Updates an existing service by its primary key.
// ---------------------------------------------------------------------------
exports.updateService = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    if (req.file) {
      req.body.logo = req.file.path;
    }

    if (req.body.capabilities) {
      req.body.capabilities = parseArray(req.body.capabilities);
    }

    const service = await Service.findByPk(req.params.id, {
      include: [{ model: ServiceDetail, as: 'detail' }]
    });

    if (!service) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Extract detail fields
    const {
      details,
      expertise,
      features,
      tools,
      portfolioLink,
      ...serviceData
    } = req.body;

    // Update parent Service
    await service.update(serviceData, { transaction });

    // Update or Create child ServiceDetail
    if (details !== undefined || expertise !== undefined || features !== undefined || tools !== undefined || portfolioLink !== undefined) {
      if (service.detail) {
        // Update existing
        const detailUpdate = {};
        if (details !== undefined) detailUpdate.details = details;
        if (expertise !== undefined) detailUpdate.expertise = parseArray(expertise);
        if (features !== undefined) detailUpdate.features = parseArray(features);
        if (tools !== undefined) detailUpdate.tools = parseArray(tools);
        if (portfolioLink !== undefined) detailUpdate.portfolioLink = portfolioLink || null;

        await service.detail.update(detailUpdate, { transaction });
      } else if (details) {
        // Create new if details provided (which is required for ServiceDetail)
        await ServiceDetail.create({
          serviceId: service.id,
          details,
          expertise: parseArray(expertise),
          features: parseArray(features),
          tools: parseArray(tools),
          portfolioLink: portfolioLink || null
        }, { transaction });
      }
    }

    await transaction.commit();

    // Refetch to show updated data
    const updatedService = await Service.findByPk(req.params.id, {
      include: [{ model: ServiceDetail, as: 'detail' }]
    });

    res.status(200).json({
      success: true,
      message: 'Service and details updated successfully',
      data: updatedService
    });
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    res.status(400).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------------------
// DELETE /api/services/:id
// Deletes a service by its primary key.
// Because the Service <-> ServiceDetail association uses onDelete: 'CASCADE',
// the related ServiceDetail record is automatically removed by Sequelize/DB.
// ---------------------------------------------------------------------------
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // CASCADE: ServiceDetail is deleted automatically (defined in initAssociations.js)
    await service.destroy();

    res.status(200).json({
      success: true,
      message: 'Service and its associated details deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
