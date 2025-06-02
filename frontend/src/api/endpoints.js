export const API_BASE_URL = 'http://localhost:5009';

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  
  // Classrooms
  CLASSROOMS: {
    LIST: `${API_BASE_URL}/api/classrooms`,
    CREATE: `${API_BASE_URL}/api/classrooms`,
    GET: (id) => `${API_BASE_URL}/api/classrooms/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/classrooms/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/classrooms/${id}`,
  },
  
  // Books
  BOOKS: {
    LIST: `${API_BASE_URL}/api/books`,
    GET: (id) => `${API_BASE_URL}/api/books/${id}`,
    CREATE: `${API_BASE_URL}/api/books`,
    UPDATE: (id) => `${API_BASE_URL}/api/books/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/books/${id}`,
  },
  
  // Assignments
  ASSIGNMENTS: {
    LIST: `${API_BASE_URL}/api/assignments`,
    CREATE: `${API_BASE_URL}/api/assignments`,
    GET: (id) => `${API_BASE_URL}/api/assignments/${id}`,
  },
  
  // Student Readings
  STUDENT_READINGS: {
    CREATE: `${API_BASE_URL}/api/student-readings`,
    MY_READINGS: `${API_BASE_URL}/api/student-readings/me`,
    VALIDATE: (id) => `${API_BASE_URL}/api/student-readings/${id}/validate`,
  },
  
  // Users
  USERS: {
    LIST: `${API_BASE_URL}/api/users`,
  },
};
