import React, { useState } from 'react';
import {
  Lightbulb,
  Cpu,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Code,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ProjectIdea } from '../../types';

interface ProjectIdeasTabProps {
  projectIdeas: ProjectIdea[];
  searchQuery: string;
}

export const ProjectIdeasTab: React.FC<ProjectIdeasTabProps> = ({ projectIdeas, searchQuery }) => {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(projectIdeas[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fields = [
    { id: 'all', label: 'All Fields' },
    { id: 'fintech', label: 'M-Pesa & FinTech' },
    { id: 'ai_ml', label: 'AI & Kenyan NLP' },
    { id: 'iot_hardware', label: 'IoT & Clean Energy' },
    { id: 'health_tech', label: 'HealthTech' }
  ];

  const filteredProjects = projectIdeas.filter((p) => {
    if (selectedField !== 'all' && p.field !== selectedField) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.fieldName.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.targetCourses.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopySpec = (project: ProjectIdea) => {
    const text = `PROJECT BLUEPRINT: ${project.title}\nField: ${project.fieldName} (${project.difficulty})\nCourses: ${project.targetCourses.join(', ')}\n\nProblem Statement:\n${project.problemStatement}\n\nProposed Solution:\n${project.proposedSolution}\n\nTech Stack:\n${project.techStack.join(', ')}\n\nArchitecture:\n${project.architectureOverview}\n\nMilestones:\n${project.milestones.map((m) => `Step ${m.step}: ${m.title} - ${m.desc}`).join('\n')}\n\nViva Defense Tips:\n${project.vivaDefenseTips.map((t) => `- ${t}`).join('\n')}\n\nGenerated via EnerHub Kenya Project Lab.`;
    navigator.clipboard.writeText(text);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Field Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {fields.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedField(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedField === f.id
                ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 font-bold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>Showing {filteredProjects.length} final year project blueprints</span>
        <span className="text-[#FFD700] flex items-center gap-1 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5" /> High-Scoring Viva Architecture
        </span>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.map((project) => {
          const isExpanded = expandedId === project.id;
          const isCopied = copiedId === project.id;

          return (
            <div
              key={project.id}
              className={`bg-neutral-900/80 border rounded-2xl transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-[#FFD700] shadow-lg shadow-[#FFD700]/10' : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                className="p-4 cursor-pointer flex items-start justify-between gap-3 bg-neutral-900/50 hover:bg-neutral-900"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 rounded-md text-[10px] font-mono font-bold">
                      {project.fieldName}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-md text-[10px] font-mono">
                      {project.difficulty}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Target: {project.targetCourses.join(', ')}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {project.problemStatement}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySpec(project);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      isCopied
                        ? 'bg-emerald-500 text-black'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                    }`}
                    title="Copy Full Blueprint Spec"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy Spec'}</span>
                  </button>

                  <div className="p-2 text-xs font-bold text-neutral-400">
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>
              </div>

              {/* Expanded Details Section */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-neutral-800 space-y-4 bg-neutral-950/60 text-xs text-neutral-300">
                  {/* Proposed Solution & Tech Stack */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
                      <h4 className="font-bold text-[#FFD700] uppercase tracking-wider text-[11px]">
                        1. Proposed Technical Solution
                      </h4>
                      <p className="text-neutral-300 leading-relaxed">
                        {project.proposedSolution}
                      </p>
                    </div>

                    <div className="space-y-2 bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
                      <h4 className="font-bold text-[#FFD700] uppercase tracking-wider text-[11px]">
                        2. Recommended Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 font-mono text-[#FFD700] text-[11px] rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="pt-2">
                        <span className="text-[10px] text-neutral-500 font-mono block mb-0.5">Architecture:</span>
                        <p className="text-neutral-300">{project.architectureOverview}</p>
                      </div>
                    </div>
                  </div>

                  {/* Milestones Timeline */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                      3. Implementation Milestones Roadmap
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.milestones.map((m) => (
                        <div key={m.step} className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#FFD700] text-black font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {m.step}
                          </span>
                          <div>
                            <div className="font-bold text-white">{m.title}</div>
                            <div className="text-neutral-400 text-[11px]">{m.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Viva Defense Tips */}
                  <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1.5">
                    <h4 className="font-bold text-[#FFD700] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#FFD700]" /> 4. Viva Defense Examination Guidelines
                    </h4>
                    <div className="space-y-1 text-neutral-200">
                      {project.vivaDefenseTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#FFD700] font-bold">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
