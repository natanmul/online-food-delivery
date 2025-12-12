import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { USER_ROLES } from '../../utils/constants.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Card from '../../components/ui/Card.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: USER_ROLES.CUSTOMER
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        navigate('/');
      } else {
        setErrors({ general: result.message });
      }
    } catch (err) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        <Card>
          <Card.Body>
            {(errors.general || authError) && (
              <Alert type="error" className="mb-6">
                {errors.general || authError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
                required
              />
              
              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                  required
                />
                
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
              
              <Input
                label="Address"
                name="address"
                type="text"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, Country"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(USER_ROLES).map(([key, value]) => (
                    <div key={value} className="relative">
                      <input
                        id={`role-${value}`}
                        name="role"
                        type="radio"
                        value={value}
                        checked={formData.role === value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`role-${value}`}
                        className={`
                          flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer
                          ${formData.role === value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="text-sm font-medium capitalize">
                          {value}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
              </div>
              
              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
              >
                Create Account
              </Button>
            </form>
          </Card.Body>
          
          <Card.Footer className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Register;