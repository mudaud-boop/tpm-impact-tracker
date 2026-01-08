import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { createImpact, classifyImpact } from '@/lib/api';
import { IMPACT_CATEGORIES, JOB_FAMILIES, getCraftSkillsForJobFamily, type JobFamily, type ImpactCategory, type CraftSkillName } from '@/types';
import { PILLAR_COLORS, CATEGORY_COLORS, JOB_FAMILY_COLORS, cn } from '@/lib/utils';

export function NewImpact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    jobFamily: 'TPM' as JobFamily,
    impactCategory: '',
    pillars: [] as string[],
    quantifiedValue: '',
    quantifiedUnit: '',
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
        quantifiedUnit: result.suggestedMetrics[0] || prev.quantifiedUnit
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

    if (!form.title || !form.description || !form.impactCategory || form.pillars.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createImpact({
        ...form,
        impactCategory: form.impactCategory as ImpactCategory,
        pillars: form.pillars as CraftSkillName[],
        quantifiedValue: form.quantifiedValue ? parseFloat(form.quantifiedValue) : undefined,
        quantifiedUnit: form.quantifiedUnit || undefined,
        date: form.date
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create impact:', error);
      alert('Failed to create impact');
    } finally {
      setLoading(false);
    }
  }

  function handleJobFamilyChange(jobFamily: JobFamily) {
    // Clear pillars when changing job family since skills may differ
    setForm(prev => ({
      ...prev,
      jobFamily,
      pillars: []
    }));
  }

  function togglePillar(pillar: string) {
    setForm(prev => ({
      ...prev,
      pillars: prev.pillars.includes(pillar)
        ? prev.pillars.filter(p => p !== pillar)
        : [...prev.pillars, pillar]
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

  const selectedJobFamilyLabel = JOB_FAMILIES.find(jf => jf.value === form.jobFamily)?.label || form.jobFamily;

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
          <h1 className="text-2xl font-semibold text-gray-900">New Impact</h1>
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

        {/* Title */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
            placeholder="Brief title for your impact"
          />
        </div>

        {/* Description with AI */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
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
            placeholder="Describe your impact in detail. The AI will help classify it to craft skill pillars."
          />
        </div>

        {/* Category */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Impact Category <span className="text-red-500">*</span>
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

        {/* Craft Skills (Pillars) */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {selectedJobFamilyLabel} Craft Skills <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {craftSkills.map(pillar => (
              <button
                key={pillar}
                type="button"
                onClick={() => togglePillar(pillar)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border',
                  form.pillars.includes(pillar)
                    ? 'border-transparent'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                )}
                style={form.pillars.includes(pillar) ? {
                  backgroundColor: `${PILLAR_COLORS[pillar]}15`,
                  color: PILLAR_COLORS[pillar],
                  borderColor: `${PILLAR_COLORS[pillar]}30`
                } : {}}
              >
                {pillar}
              </button>
            ))}
          </div>
        </div>

        {/* Quantified Metrics */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quantified Metric (optional)
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              value={form.quantifiedValue}
              onChange={(e) => setForm({ ...form, quantifiedValue: e.target.value })}
              className="input w-32"
              placeholder="Value"
            />
            <input
              type="text"
              value={form.quantifiedUnit}
              onChange={(e) => setForm({ ...form, quantifiedUnit: e.target.value })}
              className="input flex-1"
              placeholder="Unit (e.g., hours saved, risks mitigated, teams unblocked)"
            />
          </div>
        </div>

        {/* Date */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input w-48"
          />
        </div>

        {/* Tags */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Program Tags
          </label>
          <div className="flex gap-2 mb-2">
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
              className="input flex-1"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={() => {
                addTag(tagInput, 'programTags');
                setTagInput('');
              }}
              className="btn btn-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.programTags.map((tag, i) => (
              <span key={i} className="badge flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(i, 'programTags')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Stakeholders */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stakeholders
          </label>
          <div className="flex gap-2 mb-2">
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
              className="input flex-1"
              placeholder="Add a stakeholder and press Enter"
            />
            <button
              type="button"
              onClick={() => {
                addTag(stakeholderInput, 'stakeholders');
                setStakeholderInput('');
              }}
              className="btn btn-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.stakeholders.map((s, i) => (
              <span key={i} className="badge flex items-center gap-1">
                {s}
                <button type="button" onClick={() => removeTag(i, 'stakeholders')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Evidence Links */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence Links
          </label>
          <div className="flex gap-2 mb-2">
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
              className="input flex-1"
              placeholder="Add a URL and press Enter"
            />
            <button
              type="button"
              onClick={() => {
                addTag(linkInput, 'evidenceLinks');
                setLinkInput('');
              }}
              className="btn btn-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.evidenceLinks.map((link, i) => (
              <span key={i} className="badge flex items-center gap-1">
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                  Link {i + 1}
                </a>
                <button type="button" onClick={() => removeTag(i, 'evidenceLinks')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
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
            {loading ? 'Saving...' : 'Save Impact'}
          </button>
        </div>
      </form>
    </div>
  );
}
