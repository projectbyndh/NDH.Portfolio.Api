const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get projects by category
exports.getProjectsByCategory = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { category: req.params.category },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    // Parse JSON fields from body
    const projectData = {
      name: req.body.name,
      client: req.body.client,
      description: req.body.description,
      category: req.body.category,
      techStack: req.body.techStack ? (typeof req.body.techStack === 'string' ? JSON.parse(req.body.techStack) : req.body.techStack) : [],
      categories: req.body.categories ? (typeof req.body.categories === 'string' ? JSON.parse(req.body.categories) : req.body.categories) : [],
      services: req.body.services ? (typeof req.body.services === 'string' ? JSON.parse(req.body.services) : req.body.services) : []
    };

    // If image was uploaded, add the Cloudinary URL
    if (req.file) {
      projectData.image = req.file.path;
    } else if (req.body.image) {
      projectData.image = req.body.image;
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    // Find the existing project first
    const existingProject = await Project.findByPk(req.params.id);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Prepare update data
    const updateData = {
      name: req.body.name || existingProject.name,
      client: req.body.client || existingProject.client,
      description: req.body.description || existingProject.description,
      category: req.body.category || existingProject.category
    };

    // Parse arrays if provided
    if (req.body.techStack) {
      updateData.techStack = typeof req.body.techStack === 'string'
        ? JSON.parse(req.body.techStack)
        : req.body.techStack;
    }

    if (req.body.categories) {
      updateData.categories = typeof req.body.categories === 'string'
        ? JSON.parse(req.body.categories)
        : req.body.categories;
    }

    if (req.body.services) {
      updateData.services = typeof req.body.services === 'string'
        ? JSON.parse(req.body.services)
        : req.body.services;
    }

    // Handle image update
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    await existingProject.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: existingProject
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
