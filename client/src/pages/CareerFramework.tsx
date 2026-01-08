import { useState } from 'react';
import { Briefcase, ChevronDown, ChevronRight, Users, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  JOB_FAMILIES,
  LEVELS,
  SHARED_CRAFT_SKILLS,
  JOB_SPECIFIC_CRAFT_SKILLS,
  getSkillsForJobFamily,
  type JobFamily,
  type Level,
  type CraftSkill,
  JOB_FAMILY_COLORS,
  CRAFT_SKILL_COLORS
} from '@/lib/craftSkills';

export function CareerFramework() {
  const [selectedJobFamily, setSelectedJobFamily] = useState<JobFamily>('TPM');
  const [selectedLevel, setSelectedLevel] = useState<Level>('Senior');
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set(['Connect Strategy to Execution']));

  const skills = getSkillsForJobFamily(selectedJobFamily);

  function toggleSkill(skillName: string) {
    setExpandedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillName)) {
        newSet.delete(skillName);
      } else {
        newSet.add(skillName);
      }
      return newSet;
    });
  }

  function expandAll() {
    setExpandedSkills(new Set(skills.map(s => s.name)));
  }

  function collapseAll() {
    setExpandedSkills(new Set());
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Career Framework</h1>
        <p className="text-gray-500 mt-1">
          Explore craft skill expectations by job family and level
        </p>
      </div>

      {/* Job Family Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-medium">Select Job Family</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(JOB_FAMILIES) as JobFamily[]).map(family => (
            <button
              key={family}
              onClick={() => setSelectedJobFamily(family)}
              className={cn(
                'p-4 rounded-lg border-2 transition-all text-left',
                selectedJobFamily === family
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: JOB_FAMILY_COLORS[family] }}
                />
                <span className="font-semibold text-gray-900">{family}</span>
              </div>
              <p className="text-xs text-gray-500">{JOB_FAMILIES[family].fullName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Level Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-medium">Select Level</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map(level => (
            <button
              key={level.name}
              onClick={() => setSelectedLevel(level.name)}
              className={cn(
                'px-4 py-2 rounded-md text-sm transition-colors',
                selectedLevel === level.name
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <span className="font-medium">{level.name}</span>
              {level.icGrade && (
                <span className="ml-1 opacity-75">({level.icGrade})</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {LEVELS.find(l => l.name === selectedLevel)?.description}
        </p>
      </div>

      {/* Skills Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-medium">
              {JOB_FAMILIES[selectedJobFamily].fullName} - {selectedLevel} Level
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Expand All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Shared Skills */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Shared Craft Skills
            </h4>
            <div className="space-y-3">
              {SHARED_CRAFT_SKILLS.map(skill => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  level={selectedLevel}
                  isExpanded={expandedSkills.has(skill.name)}
                  onToggle={() => toggleSkill(skill.name)}
                />
              ))}
            </div>
          </div>

          {/* Job-Specific Skill */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              {selectedJobFamily}-Specific Craft Skill
            </h4>
            <div className="space-y-3">
              {JOB_SPECIFIC_CRAFT_SKILLS
                .filter(skill => skill.applicableTo.includes(selectedJobFamily))
                .map(skill => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    level={selectedLevel}
                    isExpanded={expandedSkills.has(skill.name)}
                    onToggle={() => toggleSkill(skill.name)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Level Comparison */}
      <div className="card p-6">
        <h3 className="text-lg font-medium mb-4">Level Progression</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-500">Level</th>
                <th className="text-left py-2 px-4 font-medium text-gray-500">IC Grade</th>
                <th className="text-left py-2 px-4 font-medium text-gray-500">Manager Grade</th>
                <th className="text-left py-2 pl-4 font-medium text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {LEVELS.map(level => (
                <tr
                  key={level.name}
                  className={cn(
                    'border-b border-gray-100',
                    level.name === selectedLevel && 'bg-primary-50'
                  )}
                >
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => setSelectedLevel(level.name)}
                      className={cn(
                        'font-medium',
                        level.name === selectedLevel
                          ? 'text-primary-600'
                          : 'text-gray-900 hover:text-primary-600'
                      )}
                    >
                      {level.name}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{level.icGrade || '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{level.managerGrade || '-'}</td>
                  <td className="py-3 pl-4 text-gray-500">{level.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface SkillCardProps {
  skill: CraftSkill;
  level: Level;
  isExpanded: boolean;
  onToggle: () => void;
}

function SkillCard({ skill, level, isExpanded, onToggle }: SkillCardProps) {
  const expectations = skill.expectations[level] || [];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: CRAFT_SKILL_COLORS[skill.name] || '#6B7280' }}
          />
          <span className="font-medium text-gray-900">{skill.name}</span>
          {skill.isShared && (
            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
              Shared
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 py-4 bg-white">
          <p className="text-sm text-gray-500 mb-4">{skill.description}</p>
          {expectations.length > 0 ? (
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {level} Level Expectations
              </h5>
              <ul className="space-y-2">
                {expectations.map((expectation, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary-500 mt-1">•</span>
                    <span>{expectation}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No specific expectations defined for this level.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
