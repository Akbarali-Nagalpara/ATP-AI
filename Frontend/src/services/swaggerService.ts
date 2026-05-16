import { Endpoint } from '../store/useAppStore';

export const swaggerService = {
  importSwagger: async (_url: string): Promise<Endpoint[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            method: 'GET',
            path: '/api/admin/users',
            authRequired: true,
            role: 'Unknown',
            status: 'Pending',
            headers: { Authorization: 'Bearer <token>' },
            queryParams: { page: 1, limit: 10, status: 'active' },
            responseExample: {
              success: true,
              data: [
                { id: 101, name: 'Alice Smith', role: 'admin', email: 'alice@example.com' },
                { id: 102, name: 'Bob Jones', role: 'editor', email: 'bob@example.com' }
              ],
              meta: { total: 45, page: 1 }
            }
          },
          {
            id: '2',
            method: 'POST',
            path: '/api/auth/login',
            authRequired: false,
            role: 'Unknown',
            status: 'Pending',
            requestBody: { email: 'user@example.com', password: 'securePassword123' },
            responseExample: {
              success: true,
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              user: { id: 201, name: 'John Doe', role: 'user' }
            }
          },
          {
            id: '3',
            method: 'GET',
            path: '/api/client/orders',
            authRequired: true,
            role: 'Unknown',
            status: 'Pending',
            headers: { Authorization: 'Bearer <token>' },
            queryParams: { sortBy: 'date', order: 'desc' },
            responseExample: {
              success: true,
              orders: [
                { id: 'ORD-5501', total: 120.50, status: 'shipped', date: '2023-10-14' },
                { id: 'ORD-5502', total: 45.00, status: 'processing', date: '2023-10-15' }
              ]
            }
          },
          {
            id: '4',
            method: 'DELETE',
            path: '/api/admin/users/:id',
            authRequired: true,
            role: 'Unknown',
            status: 'Pending',
            headers: { Authorization: 'Bearer <token>' },
            responseExample: {
              success: true,
              message: 'User deleted successfully'
            }
          },
          {
            id: '5',
            method: 'PUT',
            path: '/api/users/settings',
            authRequired: true,
            role: 'Unknown',
            status: 'Pending',
            headers: { Authorization: 'Bearer <token>', 'Content-Type': 'application/json' },
            requestBody: { theme: 'dark', notifications: true },
            responseExample: {
              success: true,
              message: 'Settings updated'
            }
          },
          {
            id: '6',
            method: 'POST',
            path: '/api/auth/send-otp',
            authRequired: false,
            role: 'Unknown',
            status: 'Pending',
            requestBody: { mobile: '+1234567890' },
            responseExample: { success: true, message: 'OTP sent' }
          },
          {
            id: '7',
            method: 'POST',
            path: '/api/auth/verify-otp',
            authRequired: false,
            role: 'Unknown',
            status: 'Pending',
            requestBody: { mobile: '+1234567890', otp: '456789' },
            responseExample: { success: true, token: 'mock_jwt_token_456789' }
          }
        ]);
      }, 2500);
    });
  }
};
