export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-green-100 text-green-800',
    on_the_way: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready: 'Ready',
    on_the_way: 'On the way',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return texts[status] || status;
};

export const getRatingStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push({
      id: i,
      filled: i <= rating,
      className: i <= rating ? 'text-yellow-400' : 'text-gray-300'
    });
  }
  return stars;
};