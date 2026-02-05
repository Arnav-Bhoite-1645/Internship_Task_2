export const validateForm = (formData) => {
  if (formData.name.trim().length < 2) {
    return "Name is too short.";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return "Invalid email address.";
  }
  
  if (formData.message.trim().length < 10) {
    return "Message must be at least 10 chars.";
  }
  
  return null;
};

export const validateAdminPassword = (password) => {
  return password === 'admin123';
};
