import { apiClient } from '../lib/axios';
import { Endpoint, Project } from '../store/useAppStore';

export const swaggerService = {
  importSwagger: async (projectName: string, swaggerUrl: string): Promise<{ project: Project }> => {
    // 1. Post to backend import endpoint
    const response = await apiClient.post('/projects/import-swagger', {
      projectName,
      swaggerUrl,
    });

    const { project: backendProject, endpoints: backendEndpoints } = response.data.data;

    // 2. Map backend endpoints to frontend Endpoint format
    const mappedEndpoints: Endpoint[] = backendEndpoints.map((e: any) => ({
      id: e.id,
      method: e.method as Endpoint['method'],
      path: e.path,
      authRequired: e.authRequired,
      role: 'Unknown',
      status: 'Pending',
      requestBody: e.requestSchema || undefined,
      headers: e.headersSchema || undefined,
      queryParams: e.querySchema || undefined,
      responseExample: e.responseSchema || undefined,
    }));

    // 3. Map backend project to frontend Project format
    const frontendProject: Project = {
      id: backendProject.id,
      name: backendProject.name,
      swaggerUrl: backendProject.swaggerUrl,
      endpoints: mappedEndpoints,
      logs: [
        {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toLocaleTimeString(),
          message: `Imported project "${backendProject.name}" with ${mappedEndpoints.length} endpoints successfully`,
          type: 'success',
        },
      ],
      insights: [],
      tokens: [],
      testingState: 'idle',
    };

    return { project: frontendProject };
  },
};
