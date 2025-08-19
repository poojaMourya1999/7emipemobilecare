import axios from 'axios';

// Base URL for API
export const baseUrl = 'https://toolsapi-1.onrender.com/api/';
// export const baseUrl = 'http://localhost:5000/api/';

const apiService = async ({
  endpoint,
  method = 'GET',
  data = null,
  headers = {},
  token = null,
}) => {
  try {
    const authToken = localStorage.getItem('token');
    console.log('API Token:', authToken);

    const response = await axios({
      url: `${baseUrl}${endpoint}`,
      method: method.toUpperCase(),
      data: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) ? data : null,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...headers,
      },
      timeout: 10000, // 10s timeout
    });

    return response.data;
  } catch (error) {
    console.error(
      `API call error: ${method.toUpperCase()} ${endpoint}`,
      error.response?.data || error.message
    );

    throw {
      message: error.response?.data?.message || error.message || 'Unknown error',
      status: error.response?.status || 500,
      details: error.response?.data || null,
    };
  }
};

export default apiService;
