import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, ArrowLeft, Plus, X, Info } from 'lucide-react';
import { createImpact, classifyImpact } from '@/lib/api';
import { IMPACT_CATEGORIES, JOB_FAMILIES, getCraftSkillsForJobFamily, type JobFamily, type ImpactCategory, type CraftSkillName } from '@/types';
import { CATEGORY_COLORS, JOB_FAMILY_COLORS, cn } from '@/lib/utils';
import { getRubricExpectations, type Level } from '@/lib/rubricExpectations';

const LEVELS = [
  'Manager',
  'Senior',
  'Staff',
  'Sr. Staff',
  'Principal',
  'Director',
  'VP'
];

const PERFORMANCE_SCORES = [
  { value: '0', label: '0 - Not Demonstrated' },
  { value: '1', label: '1 - Insufficient Level/Scope' },
  { value: '2', label: '2 - Lacks Consistency' },
  { value: '3', label: '3 - Mostly Demonstrated' },
  { value: '4', label: '4 - Fully Demonstrated' },
  { value: '5', label: '5 - Demonstrated Above Expectations' }
];

const METRIC_CATEGORIES = {
  'Delivery & Execution': [
    'Programs/launches delivered on time',
    'Milestones hit',
    'Milestones missed',
    'Cycle time reduction (days)',
    'Scope changes managed without timeline slip'
  ],
  'Risk Management': [
    'Risks identified before becoming issues',
    'Escalations that prevented delays',
    'Incidents avoided through proactive action',
    '$ saved from early intervention',
    'Days saved from early intervention'
  ],
  'Decision Velocity': [
    'Time to decision (days reduced)',
    'Stakeholders aligned per decision',
    'Decisions unblocked',
    'Tradeoff discussions facilitated'
  ],
  'Unblocking & Dependencies': [
    'Cross-team blockers resolved',
    'Dependencies cleared ahead of schedule',
    'Teams unblocked',
    'Handoff delays eliminated'
  ],
  'Time & Efficiency Savings': [
    'Meeting hours reduced',
    'Processes automated or streamlined',
    'Hours saved across teams',
    'Redundant work identified and cut'
  ],
  'Scale & Leverage': [
    'Frameworks/templates created and adopted',
    'Teams using your playbooks',
    'Onboarding time reduced (hours)',
    'Best practices scaled across org'
  ],
  'Change Leadership': [
    'Change initiatives led',
    'Adoption rate (%)',
    'Stakeholder sentiment improvement',
    'Training/enablement sessions delivered'
  ],
  'Technical Contribution': [
    'Architecture decisions influenced',
    'Tech debt conversations facilitated',
    'Engineering velocity improvements'
  ]
};

export function NewImpact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    jobFamily: 'TPM' as JobFamily,
    level: '' as Level | '',
    selectedExpectation: '',
    impactCategory: '',
    pillars: [] as string[],
    metrics: [{ value: '', unit: '' }] as { value: string; unit: string }[],
    selfAssessmentScore: '',
    managerAssessmentScore: '',
    date: new Date().toISOString().split('T')[0],
    programTags: [] as string[],
    stakeholders: [] as string[],
    evidenceLinks: [] as string[]
  });

  const [tagInput, setTagInput] = useState('');
  const [stakeholderInput, setStakeholderInput] = useState('');
  const [linkInput, setLinkInput] = useState('');

  // Get craft skills for selected job family
  const craftSkills = getCraftSkillsForJobFamily(form.jobFamily);

  // Get rubric expectations based on job family, craft skill, and level
  const rubricExpectations = form.pillars[0] && form.level
    ? getRubricExpectations(form.jobFamily, form.pillars[0], form.level as Level)
    : [];

  async function handleAIClassify() {
    if (!form.description.trim()) {
      alert('Please enter a description first');
      return;
    }

    setClassifying(true);
    try {
      const result = await classifyImpact(form.description);
      // Filter pillars to only include ones valid for current job family
      const validPillars = result.pillars.filter(p => craftSkills.includes(p));
      setForm(prev => ({
        ...prev,
        pillars: validPillars,
        impactCategory: result.category,
        metrics: result.suggestedMetrics[0]
          ? [{ value: '', unit: result.suggestedMetrics[0] }]
          : prev.metrics
      }));
    } catch (error) {
      console.error('Classification failed:', error);
      alert('AI classification failed');
    } finally {
      setClassifying(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.selectedExpectation || !form.description || form.pillars.length === 0 || !form.level) {
      alert('Please fill in all required fields');
      return;
    }

    // Format metrics for storage
    const validMetrics = form.metrics.filter(m => m.value && m.unit);
    const firstMetric = validMetrics[0];
    // Store just the unit names, not the values (values are summed separately)
    const metricsString = validMetrics.length > 1
      ? validMetrics.map(m => `${m.value} ${m.unit}`).join('; ')
      : firstMetric?.unit || undefined;

    setLoading(true);
    try {
      await createImpact({
        ...form,
        impactCategory: form.impactCategory as ImpactCategory,
        pillars: form.pillars as CraftSkillName[],
        quantifiedValue: firstMetric ? parseFloat(firstMetric.value) : undefined,
        quantifiedUnit: metricsString || undefined,
        date: form.date
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create assessment:', error);
      alert('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  }

  function handleJobFamilyChange(jobFamily: JobFamily) {
    // Clear pillars and selectedExpectation when changing job family since skills may differ
    setForm(prev => ({
      ...prev,
      jobFamily,
      pillars: [],
      selectedExpectation: '',
      title: ''
    }));
  }

  function addMetric() {
    setForm(prev => ({
      ...prev,
      metrics: [...prev.metrics, { value: '', unit: '' }]
    }));
  }

  function updateMetric(index: number, field: 'value' | 'unit', value: string) {
    setForm(prev => ({
      ...prev,
      metrics: prev.metrics.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }));
  }

  function removeMetric(index: number) {
    setForm(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  }

  function addTag(value: string, field: 'programTags' | 'stakeholders' | 'evidenceLinks') {
    if (!value.trim()) return;
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
  }

  function removeTag(index: number, field: 'programTags' | 'stakeholders' | 'evidenceLinks') {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">New Assessment</h1>
          <p className="text-gray-500 mt-1">Capture your contribution</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Family Selection */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Job Family <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {JOB_FAMILIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleJobFamilyChange(value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all text-left',
                  form.jobFamily === value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: JOB_FAMILY_COLORS[value] }}
                  />
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Craft Skill Selection */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Craft Skill <span className="text-red-500">*</span>
          </label>
          <select
            value={form.pillars[0] || ''}
            onChange={(e) => setForm({
              ...form,
              pillars: e.target.value ? [e.target.value] : [],
              selectedExpectation: '',
              title: ''
            })}
            className="input"
          >
            <option value="">Select a craft skill...</option>
            {craftSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        {/* Level Selection */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Level <span className="text-red-500">*</span>
          </label>
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value as Level | '', selectedExpectation: '' })}
            className="input"
          >
            <option value="">Select your level...</option>
            {LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Rubric Expectation Selection */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Rubric Expectation <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                <div className="text-center">
                  Create a new assessment for each rubric expectation at mid-year and again at end-of-year to track your progress.
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
          {!form.pillars[0] || !form.level ? (
            <p className="text-sm text-gray-500 italic">
              Select a Craft Skill and Level first to see expectations
            </p>
          ) : rubricExpectations.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No expectations found for this combination
            </p>
          ) : (
            <select
              value={form.selectedExpectation}
              onChange={(e) => {
                const selected = rubricExpectations.find(exp => exp.id === e.target.value);
                setForm({
                  ...form,
                  selectedExpectation: e.target.value,
                  title: selected ? selected.text : ''
                });
              }}
              className="input"
            >
              <option value="">Select an expectation...</option>
              {rubricExpectations.map((exp, index) => (
                <option key={exp.id} value={exp.id}>
                  {index + 1}. {exp.text.length > 100 ? exp.text.substring(0, 100) + '...' : exp.text}
                </option>
              ))}
            </select>
          )}
          {form.selectedExpectation && (
            <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm text-gray-700">
                {rubricExpectations.find(exp => exp.id === form.selectedExpectation)?.text}
              </p>
            </div>
          )}
        </div>

        {/* Relevant Examples / Evidence */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Evidence / Supporting Details <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAIClassify}
              disabled={classifying || !form.description.trim()}
              className="btn btn-secondary text-sm py-1.5 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {classifying ? 'Classifying...' : 'AI Classify'}
            </button>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input min-h-[120px]"
            placeholder="Provide relevant examples, evidence, and supporting details for this assessment."
          />
        </div>

        {/* Quantified Metrics */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Quantified Metrics (optional)
            </label>
            <button
              type="button"
              onClick={addMetric}
              className="btn btn-secondary text-sm py-1.5 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Metric
            </button>
          </div>
          <div className="space-y-3">
            {form.metrics.map((metric, index) => (
              <div key={index} className="flex gap-3 items-start">
                <input
                  type="number"
                  value={metric.value}
                  onChange={(e) => updateMetric(index, 'value', e.target.value)}
                  className="input w-28"
                  placeholder="Value"
                />
                <select
                  value={metric.unit}
                  onChange={(e) => updateMetric(index, 'unit', e.target.value)}
                  className="input flex-1"
                >
                  <option value="">Select a metric...</option>
                  {Object.entries(METRIC_CATEGORIES).map(([category, metrics]) => (
                    <optgroup key={category} label={category}>
                      {metrics.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {form.metrics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMetric(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Self Assessment
            </label>
            <select
              value={form.selfAssessmentScore}
              onChange={(e) => setForm({ ...form, selfAssessmentScore: e.target.value })}
              className="input"
            >
              <option value="">Select a score...</option>
              {PERFORMANCE_SCORES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manager Assessment
            </label>
            <select
              value={form.managerAssessmentScore}
              onChange={(e) => setForm({ ...form, managerAssessmentScore: e.target.value })}
              className="input"
            >
              <option value="">Select a score...</option>
              {PERFORMANCE_SCORES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Impact Category (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {IMPACT_CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setForm({ ...form, impactCategory: category })}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors border',
                  form.impactCategory === category
                    ? 'border-transparent'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                )}
                style={form.impactCategory === category ? {
                  backgroundColor: `${CATEGORY_COLORS[category]}15`,
                  color: CATEGORY_COLORS[category],
                  borderColor: `${CATEGORY_COLORS[category]}30`
                } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Row: Date + Program Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input"
            />
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(tagInput, 'programTags');
                    setTagInput('');
                  }
                }}
                className="input flex-1 text-sm"
                placeholder="Add tag + Enter"
              />
              <button
                type="button"
                onClick={() => {
                  addTag(tagInput, 'programTags');
                  setTagInput('');
                }}
                className="btn btn-secondary p-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {form.programTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.programTags.map((tag, i) => (
                  <span key={i} className="badge text-xs flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(i, 'programTags')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row: Stakeholders + Evidence Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stakeholders
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={stakeholderInput}
                onChange={(e) => setStakeholderInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(stakeholderInput, 'stakeholders');
                    setStakeholderInput('');
                  }
                }}
                className="input flex-1 text-sm"
                placeholder="Add stakeholder + Enter"
              />
              <button
                type="button"
                onClick={() => {
                  addTag(stakeholderInput, 'stakeholders');
                  setStakeholderInput('');
                }}
                className="btn btn-secondary p-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {form.stakeholders.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.stakeholders.map((s, i) => (
                  <span key={i} className="badge text-xs flex items-center gap-1">
                    {s}
                    <button type="button" onClick={() => removeTag(i, 'stakeholders')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Links
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(linkInput, 'evidenceLinks');
                    setLinkInput('');
                  }
                }}
                className="input flex-1 text-sm"
                placeholder="Add URL + Enter"
              />
              <button
                type="button"
                onClick={() => {
                  addTag(linkInput, 'evidenceLinks');
                  setLinkInput('');
                }}
                className="btn btn-secondary p-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {form.evidenceLinks.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.evidenceLinks.map((link, i) => (
                  <span key={i} className="badge text-xs flex items-center gap-1">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                      Link {i + 1}
                    </a>
                    <button type="button" onClick={() => removeTag(i, 'evidenceLinks')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}
