import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { authService } from '../../services/api/auth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Card from '../../components/ui/Card.jsx';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateProfileForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // In a real app, you would have an API endpoint to update user profile
      // For now, we'll just update the local state
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };
      
      updateUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setErrors({ general: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (!formData.currentPassword) {
      setErrors({ currentPassword: 'Current password is required' });
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // In a real app, you would call an API to change password
      // For now, we'll just show a success message
      setSuccessMessage('Password updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setErrors({ general: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert type="warning">
          Please sign in to view your profile.
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-3 rounded-lg ${
                  activeTab === 'password'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg ${
                  activeTab === 'orders'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Order History
              </button>
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {successMessage && (
            <Alert type="success" className="mb-6">
              {successMessage}
            </Alert>
          )}

          {errors.general && (
            <Alert type="error" className="mb-6">
              {errors.general}
            </Alert>
          )}

          {activeTab === 'profile' && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
              </Card.Header>
              
              <Card.Body>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name *"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      error={errors.name}
                      placeholder="John Doe"
                      required
                    />
                    
                    <Input
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      error={errors.email}
                      placeholder="you@example.com"
                      required
                    />
                    
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                    
                    <Input
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={loading}
                    >
                      Update Profile
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
              </Card.Header>
              
              <Card.Body>
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <Input
                    label="Current Password *"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, currentPassword: e.target.value }));
                      if (errors.currentPassword) setErrors(prev => ({ ...prev, currentPassword: '' }));
                    }}
                    error={errors.currentPassword}
                    placeholder="••••••••"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, newPassword: e.target.value }));
                        if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                      }}
                      error={errors.newPassword}
                      placeholder="••••••••"
                    />
                    
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      error={errors.confirmPassword}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={loading}
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium text-gray-900">Order History</h2>
              </Card.Header>
              
              <Card.Body>
                <p className="text-gray-600">
                  Your order history will appear here. You can view detailed information about each order,
                  track current orders, and reorder your favorite meals.
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => window.location.href = '/orders'}
                  >
                    View All Orders
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;