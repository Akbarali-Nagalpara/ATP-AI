import { useState, useEffect } from 'react';

export interface ModuleMetrics {
  activeWorkers: number;
  cpuUsage: number;
  memoryUsage: number;
  tasksCompleted: number;
  timestamp: string;
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<ModuleMetrics[]>([]);

  useEffect(() => {
    // Initial data
    const initialData = Array.from({ length: 10 }).map((_, i) => ({
      timestamp: new Date(Date.now() - (9 - i) * 5000).toLocaleTimeString(),
      activeWorkers: Math.floor(Math.random() * 20) + 10,
      cpuUsage: Math.floor(Math.random() * 40) + 20,
      memoryUsage: Math.floor(Math.random() * 30) + 40,
      tasksCompleted: Math.floor(Math.random() * 100) + 500,
    }));
    
    setMetrics(initialData);

    const interval = setInterval(() => {
      setMetrics((prev) => {
        const newData = [...prev.slice(1), {
          timestamp: new Date().toLocaleTimeString(),
          activeWorkers: Math.floor(Math.random() * 20) + 10,
          cpuUsage: Math.floor(Math.random() * 40) + 20,
          memoryUsage: Math.floor(Math.random() * 30) + 40,
          tasksCompleted: prev[prev.length - 1].tasksCompleted + Math.floor(Math.random() * 10),
        }];
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { metrics };
};