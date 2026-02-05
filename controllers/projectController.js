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
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack ? JSON.parse(req.body.techStack) : [],
      category: req.body.category,
      links: req.body.links ? JSON.parse(req.body.links) : []
    };

    // If image was uploaded, add the file path
    if (req.file) {
      // Store relative path that can be served by express.static
      projectData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // Allow direct URL if no file uploaded (for external images)
      projectData.image = req.body.image;
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
      // If file was uploaded but project doesn't exist, delete the file
      if (req.file) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Prepare update data
    const updateData = {
      title: req.body.title || existingProject.title,
      description: req.body.description || existingProject.description,
      category: req.body.category || existingProject.category
    };

    // Parse arrays if provided as strings
    if (req.body.techStack) {
      updateData.techStack = typeof req.body.techStack === 'string'
        ? JSON.parse(req.body.techStack)
        : req.body.techStack;
    }

    if (req.body.links) {
      updateData.links = typeof req.body.links === 'string'
        ? JSON.parse(req.body.links)
        : req.body.links;
    }

    // Handle image update
    if (req.file) {
      // Delete old image file if it exists in uploads folder
      if (existingProject.image && existingProject.image.startsWith('/uploads/')) {
        const fs = require('fs');
        const path = require('path');
        const oldFilePath = path.join(__dirname, '..', existingProject.image);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
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
    // If there was an error and a new file was uploaded, delete it
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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

    // Delete associated image file if it exists in uploads folder
    if (project.image && project.image.startsWith('/uploads/')) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
