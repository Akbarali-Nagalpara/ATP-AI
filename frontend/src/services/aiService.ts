import { Endpoint, AiInsight } from '../store/useAppStore';

export const aiService = {
  detectRoles: async (endpoints: Endpoint[]): Promise<Endpoint[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = endpoints.map((ep) => {
          let role = 'Public';
          if (ep.path.includes('/admin/')) role = 'Platform Admin';
          else if (ep.path.includes('/client/')) role = 'Client';
          else if (ep.path.includes('/users/')) role = 'Worker';
          
          return { ...ep, role };
        });
        resolve(updated);
      }, 2000);
    });
  },

  generateFailureInsights: async (failedEndpoints: Endpoint[]): Promise<AiInsight[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const insights = failedEndpoints.map((ep) => {
          let suggestion = 'Check request parameters or backend logs.';
          if (ep.statusCode === 403) suggestion = 'Verify role middleware and ensure correct JWT token is attached.';
          if (ep.statusCode === 500) suggestion = 'Possible unhandled exception in backend logic. Inspect server error traces.';
          if (ep.statusCode === 404) suggestion = 'Endpoint path might have changed or does not exist.';
          
          return {
            endpoint: ep.path,
            issue: `${ep.statusCode} Error`,
            suggestion,
          };
        });
        resolve(insights);
      }, 2000);
    });
  },

  detectOtpWorkflow: async (endpoints: Endpoint[]): Promise<any | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sendOtp = endpoints.find(e => 
          e.path.toLowerCase().includes('send-otp') || 
          e.path.toLowerCase().includes('login/mobile') ||
          e.path.toLowerCase().includes('auth/otp')
        );
        
        const verifyOtp = endpoints.find(e => 
          e.path.toLowerCase().includes('verify-otp') || 
          e.path.toLowerCase().includes('confirm-otp') ||
          e.path.toLowerCase().includes('auth/verify')
        );

        if (sendOtp && verifyOtp) {
          resolve({
            sendOtpApi: sendOtp.path,
            verifyOtpApi: verifyOtp.path,
            otpSource: 'terminal_logs',
            mockOtp: '456789',
            status: 'idle',
            logs: []
          });
        } else {
          resolve(null);
        }
      }, 1500);
    });
  }
};
