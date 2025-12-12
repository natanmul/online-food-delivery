import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/api/restaurants.js';
import { menuService } from '../../services/api/menu.js';
import { formatCurrency } from '../../utils/helpers.js';
import Sidebar from '../../components/layout/Sidebar.jsx';
import MenuItemForm from '../../components/restaurant/MenuItemForm.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Card from '../../components/ui/Card.jsx';

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const restaurantRes = await restaurantService.getMyRestaurant();
      
      if (restaurantRes.success) {
        setRestaurant(restaurantRes.data);
        setMenuItems(restaurantRes.data.menu_items || []);
      } else {
        setError('Failed to load restaurant menu');
      }
    } catch (err) {
      setError('An error occurred while loading menu data');
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      const response = await menuService.createMenuItem(itemData);
      
      if (response.success) {
        setMenuItems(prev => [response.data, ...prev]);
        setShowAddModal(false);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to create menu item' 
      };
    }
  };

  const handleUpdateItem = async (itemData) => {
    try {
      const response = await menuService.updateMenuItem(editingItem.id, itemData);
      
      if (response.success) {
        setMenuItems(prev => prev.map(item =>
          item.id === editingItem.id ? { ...item, ...itemData } : item
        ));
        setEditingItem(null);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update menu item' 
      };
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await menuService.deleteMenuItem(itemId);
      
      if (response.success) {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const updatedItem = { ...item, availability: !item.availability };
      const response = await menuService.updateMenuItem(item.id, updatedItem);
      
      if (response.success) {
        setMenuItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, availability: !i.availability } : i
        ));
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loader text="Loading menu..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Alert type="error">
              {error}
              <Button
                onClick={fetchMenuData}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Try Again
              </Button>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurant found</h3>
              <p className="mt-1 text-gray-500">
                You need to register a restaurant first.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
              <p className="text-gray-600">
                Manage your restaurant's menu items
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Menu Item
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{menuItems.length}</div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {menuItems.filter(item => item.availability).length}
                  </div>
                  <div className="text-sm text-gray-600">Available Items</div>
                </div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {menuItems.filter(item => !item.availability).length}
                  </div>
                  <div className="text-sm text-gray-600">Unavailable Items</div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Menu Items */}
          {menuItems.length === 0 ? (
            <Card>
              <Card.Body>
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No menu items yet</h3>
                  <p className="mt-1 text-gray-500">
                    Get started by adding your first menu item.
                  </p>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4"
                  >
                    Add Your First Item
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <Card key={item.id}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  
                  <Card.Body>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <span className="font-bold">{formatCurrency(item.price)}</span>
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.availability 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.availability ? 'Available' : 'Unavailable'}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAvailability(item)}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          {item.availability ? 'Make Unavailable' : 'Make Available'}
                        </button>
                        
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        
                        <button
                          onClick={() => setDeleteConfirm(item)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {/* Add Menu Item Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Add Menu Item"
            size="lg"
          >
            <MenuItemForm
              onSubmit={async (data) => {
                const result = await handleAddItem({
                  ...data,
                  restaurant_id: restaurant.id
                });
                if (result.success) {
                  setShowAddModal(false);
                }
                return result;
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </Modal>

          {/* Edit Menu Item Modal */}
          <Modal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            title="Edit Menu Item"
            size="lg"
          >
            {editingItem && (
              <MenuItemForm
                item={editingItem}
                onSubmit={async (data) => {
                  const result = await handleUpdateItem(data);
                  if (result.success) {
                    setEditingItem(null);
                  }
                  return result;
                }}
                onCancel={() => setEditingItem(null)}
              />
            )}
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            title="Delete Menu Item"
            size="sm"
          >
            {deleteConfirm && (
              <div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setDeleteConfirm(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteItem(deleteConfirm.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;