// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation regex (min 8 chars, at least 1 letter and 1 number)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// Phone number validation regex
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

// Name validation regex (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

// Validation functions
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be at least 8 characters long and contain at least one letter and one number';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (!NAME_REGEX.test(name)) return 'Please enter a valid name';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!PHONE_REGEX.test(phone)) return 'Please enter a valid phone number';
  return '';
};

export const validateDate = (date) => {
  if (!date) return 'Date is required';
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  // Reset time part for date comparison
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) return 'Date cannot be in the past';
  
  return '';
};

// Form validation helpers
export const validateLoginForm = (data) => {
  const errors = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegistrationForm = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAppointmentForm = (data) => {
  const errors = {};
  
  if (!data.doctorId) errors.doctorId = 'Please select a doctor';
  
  const dateError = validateDate(data.date);
  if (dateError) errors.date = dateError;
  
  if (!data.timeSlot) errors.timeSlot = 'Please select a time slot';
  
  if (!data.reason || data.reason.trim() === '') {
    errors.reason = 'Please provide a reason for the appointment';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePrescriptionForm = (data) => {
  const errors = {};
  
  if (!data.patientId) errors.patientId = 'Please select a patient';
  
  if (!data.diagnosis || data.diagnosis.trim() === '') {
    errors.diagnosis = 'Diagnosis is required';
  }
  
  if (!data.medications || data.medications.length === 0) {
    errors.medications = 'At least one medication is required';
  } else {
    const medicationErrors = [];
    
    data.medications.forEach((med, index) => {
      const medErrors = {};
      
      if (!med.name || med.name.trim() === '') {
        medErrors.name = 'Medication name is required';
      }
      
      if (!med.dosage || med.dosage.trim() === '') {
        medErrors.dosage = 'Dosage is required';
      }
      
      if (!med.frequency || med.frequency.trim() === '') {
        medErrors.frequency = 'Frequency is required';
      }
      
      if (Object.keys(medErrors).length > 0) {
        medicationErrors[index] = medErrors;
      }
    });
    
    if (Object.keys(medicationErrors).length > 0) {
      errors.medications = medicationErrors;
    }
  }
  
  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Utility function to format validation errors from the server
export const formatServerErrors = (error) => {
  if (!error.response || !error.response.data) {
    return 'An unexpected error occurred. Please try again.';
  }
  
  const { data } = error.response;
  
  if (typeof data === 'string') {
    return data;
  }
  
  if (data.message) {
    return data.message;
  }
  
  if (data.errors && Array.isArray(data.errors)) {
    return data.errors.join(', ');
  }
  
  return 'An error occurred. Please check your input and try again.';
};
