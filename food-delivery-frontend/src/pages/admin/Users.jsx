import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api/admin.js';
import { formatDate } from '../../utils/helpers.js';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [roleUpdate, setRoleUpdate] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (roleFilter) params.role = roleFilter;
      
      const response = await adminService.getAllUsers(params);
      
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('An error occurred while loading users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await adminService.deleteUser(userId);
      
      if (response.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleUpdateRole = async (userId) => {
    if (!newRole) return;
    
    try {
      const response = await adminService.updateUserRole(userId, { role: newRole });
      
      if (response.success) {
        setUsers(prev => prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        setRoleUpdate(null);
        setNewRole('');
      }
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    if (search && !user.name.toLowerCase().includes(search.toLowerCase()) && 
        !user.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      restaurant: 'bg-blue-100 text-blue-800',
      driver: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loader text="Loading users..." />
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">
              Manage all users and their roles on the platform
            </p>
          </div>

          {error && (
            <Alert type="error" className="mb-6">
              {error}
              <Button
                onClick={fetchUsers}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Try Again
              </Button>
            </Alert>
          )}

          {/* Filters */}
          <Card className="mb-8">
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftIcon={
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                </div>
                
                <div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="driver">Driver</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={fetchUsers}
                    loading={loading}
                    className="flex-1"
                  >
                    Refresh
                  </Button>
                  <Button
                    onClick={() => {
                      setSearch('');
                      setRoleFilter('');
                    }}
                    variant="outline"
                    className="flex-1"
                    disabled={!search && !roleFilter}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Users Table */}
          <Card>
            <Card.Header className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Users</h2>
              <span className="text-sm text-gray-600">
                {filteredUsers.length} users found
              </span>
            </Card.Header>
            
            <Card.Body>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10.953 10.953 0 01-.707.785 9.958 9.958 0 01-12.682 0 10.953 10.953 0 01-.707-.785" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-gray-500">
                    {users.length === 0 
                      ? "No users registered yet." 
                      : "No users match your filters."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="font-medium text-gray-600">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{user.name}</div>
                                {user.phone && (
                                  <div className="text-sm text-gray-500">{user.phone}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setRoleUpdate(user);
                                  setNewRole(user.role);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Change Role
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(user)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            title="Delete User"
            size="sm"
          >
            {deleteConfirm && (
              <div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete user "{deleteConfirm.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setDeleteConfirm(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(deleteConfirm.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Role Update Modal */}
          <Modal
            isOpen={!!roleUpdate}
            onClose={() => {
              setRoleUpdate(null);
              setNewRole('');
            }}
            title="Change User Role"
            size="sm"
          >
            {roleUpdate && (
              <div>
                <p className="text-gray-600 mb-4">
                  Change role for user: <span className="font-medium">{roleUpdate.name}</span>
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select New Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['admin', 'restaurant', 'driver', 'customer'].map(role => (
                      <div key={role} className="relative">
                        <input
                          id={`role-${role}`}
                          type="radio"
                          value={role}
                          checked={newRole === role}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`role-${role}`}
                          className={`
                            flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer
                            ${newRole === role 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span className="text-sm font-medium capitalize">
                            {role}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => {
                      setRoleUpdate(null);
                      setNewRole('');
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdateRole(roleUpdate.id)}
                    disabled={!newRole || newRole === roleUpdate.role}
                  >
                    Update Role
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

export default AdminUsers;