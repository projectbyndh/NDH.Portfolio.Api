// ❌ BROKEN CODE (causing your 404 error)
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post('/api/upload/image', formData); // ❌ 404 - endpoint didn't exist
};

// ✅ FIXED CODE
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post('http://localhost:5000/api/upload/image', formData); // ✅ Works!
};

// ==================================================
// COMPLETE BLOG EDITOR FIX
// ==================================================

// useBlogStore.js - FIXED VERSION
export const useBlogStore = () => {
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/api/upload/image', formData);

      if (response.data.success) {
        return response.data.data.imageUrl; // Returns "/uploads/filename.jpg"
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const createBlog = async (blogData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/blogs', blogData);
      return response.data;
    } catch (error) {
      console.error('Blog creation error:', error);
      throw error;
    }
  };

  return { uploadImage, createBlog };
};

// BlogEditor.jsx - FIXED VERSION
import React, { useState } from 'react';
import { useBlogStore } from './useBlogStore';

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const { uploadImage, createBlog } = useBlogStore();

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = '';

      // Step 1: Upload image if selected
      if (imageFile) {
        console.log('Uploading image...');
        finalImageUrl = await uploadImage(imageFile);
        console.log('Image uploaded successfully:', finalImageUrl);
      }

      // Step 2: Create blog with image URL
      const blogData = {
        title,
        author,
        description,
        image: finalImageUrl // Use the uploaded image URL
      };

      console.log('Creating blog with data:', blogData);
      const result = await createBlog(blogData);

      alert('Blog created successfully!');
      console.log('Blog created:', result);

      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Failed to create blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Create New Blog</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="Blog Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ fontSize: '16px' }}
          />
        </div>

        {imagePreview && (
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Image Preview:</strong></p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Blog...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default BlogEditor;