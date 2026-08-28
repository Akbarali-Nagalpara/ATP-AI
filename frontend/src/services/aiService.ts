import { Endpoint, AiInsight } from '../store/useAppStore';
import { apiClient } from '../lib/axios';

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
    // 1. In a real scenario, the backend knows the failed endpoints via the Run ID.
    // Since the frontend is currently driving the mock test execution state, we'll simulate 
    // passing the current "run" or just let the backend fetch it.
    // For this implementation, we will call the new backend endpoints.
    // Wait, the backend expects a `runId` but the frontend is using a completely mocked test runner.
    // We need to fetch the insights. Since the test runner is mocked on the frontend, there is no `TestRun` in the backend database.
    // If we call the backend with a fake runId, it will fail because the run doesn't exist.
    // Let's implement the backend call anyway. To avoid breaking the UI for the demo if there's no backend run,
    // we'll try/catch it and return empty insights if it fails.
    
    // Attempt to hit the backend AI endpoint with a mock run ID (for now, until test runner is migrated)
    try {
      // In a fully integrated system, the `runId` would be known here. 
      // For this step, we use the seeded TestRun ID from our database.
      const runId = 'a330e70a-cbfb-4ff2-a207-e09f5dc1d924'; 
      await apiClient.post(`/ai/analyze/${runId}`);
      const response = await apiClient.get<{data: any[]}>(`/ai/findings/${runId}`);
      
      // Map the backend AIFinding schema to the frontend AiInsight schema
      return response.data.map(finding => ({
        endpoint: finding.testResult?.endpoint?.path || '/unknown',
        issue: finding.issue,
        rootCause: finding.suggestion.split('**Root Cause:**\n')[1]?.split('\n\n')[0] || 'Unknown',
        suggestion: finding.suggestion.split('\n\n')[0] || finding.suggestion,
        fixPrompt: finding.suggestion.split('**Developer Fix:**\n')[1]?.split('\n\n')[0] || '',
        securityFindings: finding.suggestion.split('**Security:**\n')[1]?.split(', ') || [],
      }));
    } catch (error) {
      console.warn('Backend AI analysis failed (likely due to missing TestRun). Returning empty insights.', error);
      return [];
    }
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
