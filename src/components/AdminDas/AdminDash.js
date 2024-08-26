'use client';

import { AuthContext } from '@/app/context/auth';
import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';

function AdminDash() {
  const { token, user } = useContext(AuthContext);
  const [image1, setImg] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    ISBN: '',
    publication_date: '',
    genre: '',
    quantity: '',
    image: '',
  });

  const genres = [
    'Westerns', 'True Crime', 'Travel', 'Sports', 'Social Sciences',
    'Self-Help', 'Science & Math', 'Sci-Fi & Fantasy', 'Romance', 'Religion',
    'Parenting', 'Mysteries', 'Medical', 'Literature & Fiction', 'Kids',
    'Horror', 'Home & Garden', 'Hobbies & Crafts', 'History', 'Health & Fitness',
    'Entertainment', 'Edu & Reference', 'Cooking', 'Computers & Tech', 'Comics',
    'Business', 'Biographies', 'Arts & Music',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; 
    setImg(file); 
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const imageFormData = new FormData();
      imageFormData.append('image', image1);
  
      const imageResponse = await fetch(
        'https://api.imgbb.com/1/upload?key=34ef744f3065352f950f2d56538afc4f',
        {
          method: 'POST',
          body: imageFormData,
        }
      );
  
      if (!imageResponse.ok) {
        throw new Error('Image upload failed');
      }
  
      const imageData = await imageResponse.json();
      if (!imageData || !imageData.data || !imageData.data.url) {
        throw new Error('Invalid image upload response');
      }
      const pp = imageData.data.url;
      const finalFormData = { ...formData, image: pp };
      const response = await fetch('http://127.0.0.1:8000/books/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(finalFormData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        console.log('Response data:', responseData);
        throw new Error('Failed to add book');
      }
  
      toast.success('Book added successfully!');
      setFormData({
        title: '',
        description: '',
        author: '',
        ISBN: '',
        publication_date: '',
        genre: '',
        quantity: '',
        image: '',
      });
      setImg(null); 
  
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book.');
    }
  };
  
  
  return (
    <div>
      <div className="container mx-auto p-6">
      <h1 className="text-center text-3xl font-bold mb-6">Add a New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">ISBN</label>
          <input
            type="text"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Publication Date</label>
          <input
            type="date"
            name="publication_date"
            value={formData.publication_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Genre</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>Select a genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Image URL</label>
          <input
            type="file"
            name="image"
            value={formData.image}
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Book
        </button>
      </form>
    </div>
    </div>
  )
}

export default AdminDash
