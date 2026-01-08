import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { type Impact, type JobFamily, JOB_FAMILIES, getCraftSkillsForJobFamily } from '@/types';
import { getRubricExpectations, type Level } from '@/lib/rubricExpectations';
import { cn } from '@/lib/utils';

const LEVELS: Level[] = ['Manager', 'Senior', 'Staff', 'Sr. Staff', 'Principal', 'Director', 'VP'];

interface RubricTrackerProps {
  impacts: Impact[];
}

interface ExpectationStatus {
  id: string;
  text: string;
  covered: boolean;
  impactCount: number;
}

interface SkillStatus {
  skill: string;
  expectations: ExpectationStatus[];
  covered: number;
  total: number;
}

export function RubricTracker({ impacts }: RubricTrackerProps) {
  const [jobFamily, setJobFamily] = useState<JobFamily>('TPM');
  const [level, setLevel] = useState<Level>('Staff');
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  const craftSkills = getCraftSkillsForJobFamily(jobFamily);

  // Calculate coverage for each craft skill and expectation
  const skillStatuses = useMemo((): SkillStatus[] => {
    return craftSkills.map(skill => {
      const expectations = getRubricExpectations(jobFamily, skill, level);

      const expectationStatuses: ExpectationStatus[] = expectations.map(exp => {
        // Check if any impact has this expectation as its title (which stores the expectation text)
        const matchingImpacts = impacts.filter(impact =>
          impact.title === exp.text &&
          impact.pillars.includes(skill) &&
          impact.jobFamily === jobFamily
        );

        return {
          id: exp.id,
          text: exp.text,
          covered: matchingImpacts.length > 0,
          impactCount: matchingImpacts.length
        };
      });

      return {
        skill,
        expectations: expectationStatuses,
        covered: expectationStatuses.filter(e => e.covered).length,
        total: expectationStatuses.length
      };
    });
  }, [impacts, jobFamily, level, craftSkills]);

  // Calculate overall stats
  const totalExpectations = skillStatuses.reduce((sum, s) => sum + s.total, 0);
  const totalCovered = skillStatuses.reduce((sum, s) => sum + s.covered, 0);
  const coveragePercent = totalExpectations > 0 ? Math.round((totalCovered / totalExpectations) * 100) : 0;

  const toggleSkill = (skill: string) => {
    setExpandedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSkills(new Set(craftSkills));
  };

  const collapseAll = () => {
    setExpandedSkills(new Set());
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={expandAll} className="text-primary-600 hover:underline">Expand All</button>
          <span className="text-gray-300">|</span>
          <button onClick={collapseAll} className="text-primary-600 hover:underline">Collapse All</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Job Family</label>
          <select
            value={jobFamily}
            onChange={(e) => setJobFamily(e.target.value as JobFamily)}
            className="input text-sm py-1.5"
          >
            {JOB_FAMILIES.map(jf => (
              <option key={jf.value} value={jf.value}>{jf.value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="input text-sm py-1.5"
          >
            {LEVELS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900">{totalCovered} / {totalExpectations} expectations</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={cn(
              "h-3 rounded-full transition-all",
              coveragePercent === 100 ? "bg-green-500" : coveragePercent >= 50 ? "bg-yellow-500" : "bg-red-400"
            )}
            style={{ width: `${coveragePercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {coveragePercent === 100
            ? "All expectations covered! You're ready for your review."
            : `${totalExpectations - totalCovered} expectations still need supporting evidence.`
          }
        </p>
      </div>

      {/* Skill Breakdown */}
      <div className="space-y-3">
        {skillStatuses.map(({ skill, expectations, covered, total }) => (
          <div key={skill} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSkill(skill)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSkills.has(skill) ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span className="font-medium text-gray-900">{skill}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium",
                  covered === total ? "text-green-600" : "text-gray-600"
                )}>
                  {covered}/{total}
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      covered === total ? "bg-green-500" : covered > 0 ? "bg-yellow-500" : "bg-gray-300"
                    )}
                    style={{ width: `${total > 0 ? (covered / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </button>

            {expandedSkills.has(skill) && (
              <div className="p-3 space-y-2 bg-white">
                {expectations.map((exp, index) => (
                  <div
                    key={exp.id}
                    className={cn(
                      "flex items-start gap-3 p-2 rounded-md",
                      exp.covered ? "bg-green-50" : "bg-gray-50"
                    )}
                  >
                    {exp.covered ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm",
                        exp.covered ? "text-gray-700" : "text-gray-500"
                      )}>
                        <span className="font-medium">{index + 1}.</span> {exp.text}
                      </p>
                      {exp.covered && exp.impactCount > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          {exp.impactCount} assessment{exp.impactCount > 1 ? 's' : ''} recorded
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
