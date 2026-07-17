import { Endpoint } from '../store/useAppStore';

export const testRunnerService = {
  collectTokens: async (): Promise<Record<string, string>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          'Platform Admin': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Admin...',
          'Client': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Client...',
          'Worker': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Worker...',
        });
      }, 1500);
    });
  },

  runTest: async (endpoint: Endpoint, token?: string): Promise<{ passed: boolean; statusCode: number; responseTime: number; extractedToken?: string }> => {
    return new Promise((resolve) => {
      // Simulate real-world delay for testing
      const delay = Math.floor(Math.random() * 500) + 200;
      setTimeout(() => {
        const path = endpoint.path.toLowerCase();
        const isAuthEndpoint = path.includes('login') || path.includes('auth') || path.includes('token') || path.includes('register');

        // Mock logic: token extraction for auth endpoints
        if (isAuthEndpoint) {
          resolve({ 
            passed: true, 
            statusCode: 200, 
            responseTime: delay, 
            extractedToken: `mock_jwt_${endpoint.role.toLowerCase()}_${Math.random().toString(36).substr(2, 5)}` 
          });
        }
        // Fail if it requires auth but no token was provided
        else if (endpoint.authRequired && !token) {
          resolve({ passed: false, statusCode: 401, responseTime: delay });
        }
        else if (path.includes('/client/orders')) {
          resolve({ passed: false, statusCode: 403, responseTime: delay });
        } else if (path.includes('delete')) {
          resolve({ passed: false, statusCode: 500, responseTime: delay });
        } else {
          resolve({ passed: true, statusCode: 200, responseTime: delay });
        }
      }, delay);
    });
  },

  simulateOtpWorkflow: async (
    workflow: any, 
    onUpdate: (data: any) => void,
    onLog: (message: string, type: 'info' | 'success' | 'warning' | 'error' | 'otp') => void
  ): Promise<string> => {
    return new Promise(async (resolve) => {
      // 1. Send OTP
      onUpdate({ status: 'waiting' });
      onLog(`Running POST ${workflow.sendOtpApi}`, 'info');
      await new Promise(r => setTimeout(r, 1000));
      onLog(`OTP generated for user: ${workflow.mockOtp}`, 'otp');
      
      // 2. Monitoring
      onLog('Monitoring logs...', 'info');
      await new Promise(r => setTimeout(r, 1200));
      onUpdate({ status: 'detected' });
      onLog('OTP detected successfully', 'success');
      
      // 3. Extraction
      await new Promise(r => setTimeout(r, 800));
      onUpdate({ status: 'captured', extractedOtp: workflow.mockOtp });
      onLog(`Extracted OTP: ${workflow.mockOtp}`, 'success');
      
      // 4. Verification
      onUpdate({ status: 'verifying' });
      onLog(`Running POST ${workflow.verifyOtpApi}`, 'info');
      await new Promise(r => setTimeout(r, 1500));
      
      // 5. Success
      onUpdate({ status: 'success' });
      onLog('Authentication Success', 'success');
      onLog('JWT Token Generated', 'success');
      
      resolve(`mock_jwt_token_${workflow.mockOtp}`);
    });
  }
};
