import React, { useState } from 'react';
import { Upload, X, Plus, Camera, ArrowLeft, Check, AlertCircle } from 'lucide-react';

const UploadNewItemPage = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
    isApproved: false
  });
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Clothing',
    'Shoes',
    'Accessories',
    'Bags',
    'Jewelry',
    'Electronics',
    'Books',
    'Home & Garden',
    'Sports',
    'Other'
  ];

  const clothingTypes = [
    'T-Shirt',
    'Shirt',
    'Dress',
    'Jacket',
    'Jeans',
    'Pants',
    'Shorts',
    'Skirt',
    'Sweater',
    'Hoodie',
    'Blazer',
    'Coat'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const conditions = [
    'Brand New',
    'Like New',
    'Very Good',
    'Good',
    'Fair',
    'Poor'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (images.length < 2) {
      alert('Please upload at least 2 images of your product');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Form Data:', formData);
    console.log('Images:', images);
    
    // Show success message
    alert('Item uploaded successfully! It will be reviewed and approved soon.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold">ReWear</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Item</h1>
            <p className="text-gray-600">Share your preloved items with the ReWear community</p>
          </div>

          <div className="space-y-8">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">Upload at least 2 high-quality images of your product</p>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images ({images.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Vintage Denim Jacket"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  {clothingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your item in detail. Include brand, material, styling details, and any flaws or wear..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Be honest about the condition and include any relevant details that buyers should know.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., vintage, designer, casual, summer (separate with commas)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add relevant tags to help others find your item (optional)
              </p>
            </div>

            {/* Approval Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Approval Process</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your item will be reviewed by our team within 24-48 hours. You'll receive a notification once it's approved and visible to other users.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              
              <button
                type="submit"
                className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for a Great Listing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Camera className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">High-Quality Photos</h4>
                <p className="text-sm text-gray-600">Take clear, well-lit photos from multiple angles</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Honest Description</h4>
                <p className="text-sm text-gray-600">Be transparent about condition and any flaws</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Plus className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Complete Details</h4>
                <p className="text-sm text-gray-600">Fill in all relevant information for better visibility</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Quick Response</h4>
                <p className="text-sm text-gray-600">Respond promptly to interested buyers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNewItemPage;