export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

// Specific role checkers for convenience
export const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customers only.'
    });
  }
  next();
};

export const isRestaurant = (req, res, next) => {
  if (req.user.role !== 'restaurant') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Restaurant owners only.'
    });
  }
  next();
};

export const isDriver = (req, res, next) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Drivers only.'
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
  next();
};

export const isAdminOrRestaurant = (req, res, next) => {
  if (!['admin', 'restaurant'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins or restaurant owners only.'
    });
  }
  next();
};