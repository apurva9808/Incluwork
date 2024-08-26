import { LoginCredentials, LoginResponse } from '../models/User';
import {SignUpData, SignupResponse} from '../models/User';

const API_URL = 'http://localhost:3000/incluwork';

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(API_URL + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to log in');
  }
  const data: LoginResponse = await response.json();


  return data;
};

 const signup = async (formData: SignUpData): Promise<SignupResponse> => {
  const response = await fetch(API_URL + '/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register');
  }
  
  const data: SignupResponse = await response.json();
 

  return data;
};



export default { login , signup};
