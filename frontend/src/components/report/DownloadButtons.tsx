import { useState } from 'react';
import { FileText, Code, Globe, Loader2, Check } from 'lucide-react';
import { Project } from '../../store/useAppStore';

interface DownloadButtonsProps {
  project: Project;
  disabled?: boolean;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({ project, disabled = false }) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [completeFormat, setCompleteFormat] = useState<string | null>(null);

  const simulateDownload = (format: 'pdf' | 'json' | 'html') => {
    if (disabled || downloadingFormat) return;
    setDownloadingFormat(format);

    setTimeout(() => {
      let fileData = '';
      let mimeType = 'text/plain';
      let extension = 'txt';

      if (format === 'json') {
        fileData = JSON.stringify(project, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else if (format === 'html') {
        fileData = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>ATP AI Test Report - ${project.name}</title>
            <style>
              body { font-family: sans-serif; background-color: #121214; color: #e4e4e7; padding: 40px; }
              h1 { color: #ffffff; }
              .card { background: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
              .status-pass { color: #10b981; }
              .status-fail { color: #f43f5e; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 12px; border-bottom: 1px solid #27272a; text-align: left; }
              th { background: #27272a; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>ATP AI Final Test Report: ${project.name}</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Swagger Reference: ${project.swaggerUrl}</p>
              <p>Testing State: <strong>${project.testingState}</strong></p>
            </div>
            <div class="card">
              <h2>Execution Summary</h2>
              <p>Total APIs Tested: ${project.endpoints.length}</p>
              <p>Passed APIs: ${project.endpoints.filter(e => e.status === 'Pass').length}</p>
              <p>Failed APIs: ${project.endpoints.filter(e => e.status === 'Fail').length}</p>
            </div>
            <div class="card">
              <h2>Detailed Results</h2>
              <table>
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Path</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Status Code</th>
                    <th>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  ${project.endpoints.map(e => `
                    <tr>
                      <td><strong>${e.method}</strong></td>
                      <td><code>${e.path}</code></td>
                      <td>${e.role}</td>
                      <td class="${e.status === 'Pass' ? 'status-pass' : 'status-fail'}">${e.status}</td>
                      <td><strong>${e.statusCode || '--'}</strong></td>
                      <td>${e.responseTime ? `${e.responseTime}ms` : '--'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </body>
          </html>
        `;
        mimeType = 'text/html';
        extension = 'html';
      } else {
        // PDF Simulation
        fileData = `--- ATP AI TEST REPORT ---\nProject: ${project.name}\nGenerated: ${new Date().toLocaleString()}\nTotal: ${project.endpoints.length}\n`;
        mimeType = 'application/pdf';
        extension = 'pdf';
      }

      // Create download anchor
      const blob = new Blob([fileData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_report.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingFormat(null);
      setCompleteFormat(format);
      setTimeout(() => setCompleteFormat(null), 2000);
    }, 1500);
  };

  const btnBase = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-md shrink-0";
  const activeBtn = "bg-[#18181b] border-white/5 text-gray-300 hover:text-white hover:bg-white/[0.03] active:scale-95";
  const pdfBtn = "bg-[var(--color-primary)] hover:opacity-90 border-transparent text-white active:scale-95";
  const disabledBtn = "opacity-40 cursor-not-allowed grayscale border-white/5 bg-white/[0.01] text-gray-600";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Export as PDF */}
      <button
        onClick={() => simulateDownload('pdf')}
        disabled={disabled || !!downloadingFormat}
        className={`${btnBase} ${disabled ? disabledBtn : pdfBtn}`}
      >
        {downloadingFormat === 'pdf' ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : completeFormat === 'pdf' ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <FileText className="w-4 h-4 text-white" />
        )}
        {downloadingFormat === 'pdf' ? 'Generating PDF...' : completeFormat === 'pdf' ? 'Report Downloaded!' : 'Export PDF'}
      </button>

      {/* Export as HTML */}
      <button
        onClick={() => simulateDownload('html')}
        disabled={disabled || !!downloadingFormat}
        className={`${btnBase} ${disabled ? disabledBtn : activeBtn}`}
      >
        {downloadingFormat === 'html' ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : completeFormat === 'html' ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Globe className="w-4 h-4 text-gray-400" />
        )}
        {downloadingFormat === 'html' ? 'Generating HTML...' : completeFormat === 'html' ? 'HTML Downloaded!' : 'Download HTML'}
      </button>

      {/* Export as JSON */}
      <button
        onClick={() => simulateDownload('json')}
        disabled={disabled || !!downloadingFormat}
        className={`${btnBase} ${disabled ? disabledBtn : activeBtn}`}
      >
        {downloadingFormat === 'json' ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : completeFormat === 'json' ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Code className="w-4 h-4 text-gray-400" />
        )}
        {downloadingFormat === 'json' ? 'Structuring JSON...' : completeFormat === 'json' ? 'JSON Downloaded!' : 'Download Raw JSON'}
      </button>
    </div>
  );
};
