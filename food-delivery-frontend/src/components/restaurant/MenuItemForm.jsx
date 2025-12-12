import React, { useState, useEffect } from 'react';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

const MenuItemForm = ({ item = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    availability: true,
    restaurant_id: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        image_url: item.image_url || '',
        availability: item.availability !== undefined ? item.availability : true,
        restaurant_id: item.restaurant_id || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.restaurant_id) {
      newErrors.restaurant_id = 'Restaurant ID is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const submitData = {
      ...formData,
      price: Number(formData.price),
      description: formData.description || null,
      image_url: formData.image_url || null
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Item Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter item name"
          required
        />
        
        <Input
          label="Price *"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0.00"
          leftIcon={
            <span className="text-gray-500">$</span>
          }
          required
        />
        
        <div className="md:col-span-2">
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter item description"
          />
        </div>
        
        <div className="md:col-span-2">
          <Input
            label="Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            helperText="Optional image URL for the menu item"
          />
        </div>
        
        {!item && (
          <div className="md:col-span-2">
            <Input
              label="Restaurant ID *"
              name="restaurant_id"
              value={formData.restaurant_id}
              onChange={handleChange}
              error={errors.restaurant_id}
              placeholder="Enter restaurant ID"
              required
            />
          </div>
        )}
        
        <div className="flex items-center">
          <input
            id="availability"
            name="availability"
            type="checkbox"
            checked={formData.availability}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="availability" className="ml-2 text-sm text-gray-700">
            Available for ordering
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          loading={loading}
        >
          {item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;