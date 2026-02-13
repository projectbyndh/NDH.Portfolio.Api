const Blog = require('../models/Blog');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    console.log('📝 Fetching all blogs...');
    const blogs = await Blog.findAll({
      order: [['date', 'DESC']]
    });
    console.log(`✅ Retrieved ${blogs.length} blogs`);
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    console.log(`🔍 Fetching blog with ID: ${req.params.id}`);
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      console.warn(`⚠️  Blog not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    console.log(`✅ Blog found: ${blog.title}`);
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error(`❌ Error fetching blog ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    console.log('📥 createBlog called');
    console.log('📁 req.file:', req.file);
    console.log('📄 req.body:', req.body);

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
    }

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('❌ Error creating blog:', error.message);
    res.status(400).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message
    });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    console.log(`✏️  Updating blog ID: ${req.params.id}`);
    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
      console.log('🖼️  New image uploaded:', req.file.path);
    }

    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      console.warn(`⚠️  Blog not found for update: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await blog.update(req.body);
    console.log(`✅ Blog updated successfully: ${blog.title}`);

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error(`❌ Error updating blog ${req.params.id}:`, error.message);
    res.status(400).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    console.log(`🗑️  Deleting blog ID: ${req.params.id}`);
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      console.warn(`⚠️  Blog not found for deletion: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const blogTitle = blog.title;
    await blog.destroy();
    console.log(`✅ Blog deleted successfully: ${blogTitle}`);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error(`❌ Error deleting blog ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
