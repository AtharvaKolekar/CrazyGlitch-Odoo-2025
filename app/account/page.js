import React, { useState } from 'react';
import { User, ShoppingBasket, Upload, Grid, Star, MapPin, Plus, Edit, Trash2, Heart } from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Sample user data
  const userData = {
    name: "Atharva Kolekar",
    memberSince: "August 17, 2024",
    points: 650,
    location: "Mumbai",
    rating: 4.8,
    completedSwaps: 23
  };

  // Sample basket items
  const basketItems = [
    {
      id: 1,
      name: "Vintage Denim Jacket",
      brand: "Levi's",
      points: 400,
      location: "Mumbai",
      image: "/api/placeholder/150/150"
    },
    {
      id: 2,
      name: "Designer Cotton Shirt",
      brand: "Van Heusen",
      points: 250,
      location: "Bangalore",
      image: "/api/placeholder/150/150"
    }
  ];

  // Sample user uploads
  const userUploads = [
    {
      id: 1,
      name: "Floral Summer Dress",
      brand: "Zara",
      points: 300,
      status: "Available",
      views: 45,
      likes: 12,
      image: "/api/placeholder/150/150"
    },
    {
      id: 2,
      name: "Casual Sneakers",
      brand: "Adidas",
      points: 200,
      status: "Swapped",
      views: 32,
      likes: 8,
      image: "/api/placeholder/150/150"
    },
    {
      id: 3,
      name: "Winter Coat",
      brand: "H&M",
      points: 450,
      status: "Available",
      views: 67,
      likes: 23,
      image: "/api/placeholder/150/150"
    }
  ];

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const ItemCard = ({ item, showActions = false, onRemove = null }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="aspect-square bg-gray-200 relative">
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-medium">
          {item.points}
        </div>
        {item.location && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {item.location}
          </div>
        )}
        {item.status && (
          <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
            item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {item.status}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
        
        {item.views && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{item.views} views</span>
            <span className="flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              {item.likes}
            </span>
          </div>
        )}
        
        {showActions && (
          <div className="flex space-x-2 mt-2">
            <button className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600 transition-colors">
              <Edit className="w-3 h-3 inline mr-1" />
              Edit
            </button>
            <button 
              onClick={() => onRemove && onRemove(item.id)}
              className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-3 h-3 inline mr-1" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">ReWear</h1>
                <p className="text-sm text-gray-600">Sustainable Fashion Exchange</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Login
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">A</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600">Member since {userData.memberSince}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{userData.rating} rating</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={User}
              title="Total Points"
              value={userData.points}
              color="text-yellow-600"
            />
            <StatCard
              icon={ShoppingBasket}
              title="Items in Basket"
              value={basketItems.length}
              color="text-blue-600"
            />
            <StatCard
              icon={Grid}
              title="Completed Swaps"
              value={userData.completedSwaps}
              color="text-green-600"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'basket', label: 'My Basket', icon: ShoppingBasket },
              { id: 'uploads', label: 'My Uploads', icon: Grid },
              { id: 'upload', label: 'Upload New Item', icon: Upload }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'basket' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">My Basket ({basketItems.length} items)</h3>
              {basketItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {basketItems.map(item => (
                    <ItemCard key={item.id} item={item} showActions={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBasket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Your basket is empty</p>
                  <p className="text-sm text-gray-500 mt-1">Browse items to add them to your basket</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'uploads' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">My Uploads ({userUploads.length} items)</h3>
              {userUploads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userUploads.map(item => (
                    <ItemCard key={item.id} item={item} showActions={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't uploaded any items yet</p>
                  <p className="text-sm text-gray-500 mt-1">Start by uploading your first item</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Upload New Item</h3>
              <div className="max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Photos
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Vintage Denim Jacket"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Levi's"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select Category</option>
                        <option>Jackets</option>
                        <option>Shirts</option>
                        <option>Dresses</option>
                        <option>Shoes</option>
                        <option>Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Select Size</option>
                        <option>XS</option>
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                        <option>XXL</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Value
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the item's condition, style, and any other relevant details..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Upload Item
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
