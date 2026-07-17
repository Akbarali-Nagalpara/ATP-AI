import { 
  FileText, ShieldCheck, Key, PlayCircle, BarChart4, CheckCircle2, Loader2 
} from 'lucide-react';
import { Project } from '../../store/useAppStore';

interface ExecutionTimelineProps {
  project: Project;
}

interface Step {
  id: string;
  title: string;
  description: string;
  states: Project['testingState'][];
  icon: React.ElementType;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ project }) => {
  const steps: Step[] = [
    {
      id: 'import',
      title: 'Swagger Spec Import',
      description: 'Fetch schemas and map endpoints to query matrix.',
      states: ['importing'],
      icon: FileText
    },
    {
      id: 'roles',
      title: 'AI Role Identification',
      description: 'Analyze security layers and discover request privilege boundaries.',
      states: ['detecting_roles'],
      icon: ShieldCheck
    },
    {
      id: 'tokens',
      title: 'Token Collection & Auth',
      description: 'Simulate OTP authentications and load credential tokens.',
      states: ['collecting_tokens'],
      icon: Key
    },
    {
      id: 'test',
      title: 'Test Suite Execution',
      description: 'Run automated functional validation sweeps across routes.',
      states: ['testing'],
      icon: PlayCircle
    },
    {
      id: 'analyze',
      title: 'AI Analysis & Remediation',
      description: 'Diagnose failures and generate code-level suggested fixes.',
      states: ['analyzing'],
      icon: BarChart4
    },
    {
      id: 'complete',
      title: 'Report Compiled',
      description: 'Generate interactive analytics and finalize the audit report.',
      states: ['completed'],
      icon: CheckCircle2
    }
  ];

  // Helper to determine the visual state of a step
  const getStepStatus = (stepStates: Project['testingState'][]): 'pending' | 'running' | 'completed' => {
    const currentState = project.testingState;
    
    if (currentState === 'completed') {
      return 'completed';
    }

    const currentIdx = steps.findIndex(s => s.states.includes(currentState));
    const stepIdx = steps.findIndex(s => s.states.includes(stepStates[0]));

    if (currentIdx === -1) return 'pending';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'running';
    return 'pending';
  };

  return (
    <div className="bg-[#0d0d0f]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-full">
      <div className="mb-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Execution Pipeline Timeline</h4>
        <p className="text-xs text-gray-400 mt-1">Live status tracking of the ATP AI test process</p>
      </div>

      <div className="relative pl-6 space-y-6 border-l border-white/5 py-2 ml-3">
        {steps.map((step) => {
          const status = getStepStatus(step.states);
          const StepIcon = step.icon;

          let bulletBg = 'bg-[#121214] border-white/5 text-gray-500';
          let borderGlow = '';
          let textTitleColor = 'text-gray-400';
          let descColor = 'text-gray-500';

          if (status === 'completed') {
            bulletBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
            textTitleColor = 'text-gray-200';
            descColor = 'text-gray-400';
          } else if (status === 'running') {
            bulletBg = 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 text-[var(--color-primary)]';
            borderGlow = 'shadow-[0_0_12px_rgba(227,38,54,0.15)]';
            textTitleColor = 'text-white font-semibold';
            descColor = 'text-gray-300';
          }

          return (
            <div key={step.id} className="relative group">
              {/* Stepper Timeline Bullet */}
              <div className={`absolute -left-[37px] top-0.5 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${bulletBg} ${borderGlow}`}>
                {status === 'running' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <StepIcon className="w-3.5 h-3.5 shrink-0" />
                )}
              </div>

              {/* Stepper Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className={`text-xs ${textTitleColor} tracking-wide transition-colors duration-200`}>
                    {step.title}
                  </h5>
                  {status === 'running' && (
                    <span className="text-[9px] uppercase font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 px-2 py-0.5 rounded animate-pulse">
                      Active
                    </span>
                  )}
                  {status === 'completed' && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className={`text-[11px] ${descColor} leading-relaxed transition-colors duration-200`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
