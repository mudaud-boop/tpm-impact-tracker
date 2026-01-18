import { useState, useEffect } from 'react';
import { MessageSquare, Plus, ExternalLink, Trash2, User, Building2, Briefcase, Loader2, Link as LinkIcon, Calendar } from 'lucide-react';
import { getFeedback, createFeedback, deleteFeedback } from '@/lib/api';
import type { BetterworksFeedback as FeedbackType } from '@/types';

export function BetterworksFeedback() {
  const [entries, setEntries] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fromName: '',
    fromRole: '',
    fromOrg: '',
    feedback: '',
    link: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load feedback on mount
  useEffect(() => {
    loadFeedback();
  }, []);

  async function loadFeedback() {
    try {
      const data = await getFeedback();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const newEntry = await createFeedback({
        ...form,
        link: form.link || undefined
      });
      setEntries([newEntry, ...entries]);
      setForm({ fromName: '', fromRole: '', fromOrg: '', feedback: '', link: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save feedback:', error);
      alert('Failed to save feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await deleteFeedback(id);
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Betterworks Feedback</h1>
          <p className="text-gray-500 mt-1">Track feedback received from colleagues</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Feedback
        </button>
      </div>

      {/* Add Feedback Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="text-lg font-medium mb-4">Add New Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* From Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    From (Name)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.fromName}
                  onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                  placeholder="e.g., John Smith"
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    Role
                  </span>
                </label>
                <input
                  type="text"
                  value={form.fromRole}
                  onChange={(e) => setForm({ ...form, fromRole: e.target.value })}
                  placeholder="e.g., Staff Engineer"
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    Organization
                  </span>
                </label>
                <input
                  type="text"
                  value={form.fromOrg}
                  onChange={(e) => setForm({ ...form, fromOrg: e.target.value })}
                  placeholder="e.g., Platform Engineering"
                  className="input w-full"
                  required
                />
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                placeholder="Enter the feedback you received..."
                rows={4}
                className="input w-full"
                required
              />
            </div>

            {/* Date and Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    Link
                  </span>
                </label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="input w-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Feedback'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ fromName: '', fromRole: '', fromOrg: '', feedback: '', link: '', date: new Date().toISOString().split('T')[0] });
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback List */}
      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                    {entry.fromName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{entry.fromName}</p>
                    <p className="text-sm text-gray-500">{entry.fromRole} · {entry.fromOrg}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{entry.feedback}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
                {entry.link && (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Feedback
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="card p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-500 mb-4">Start tracking feedback you've received from colleagues</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Feedback
            </button>
          </div>
        )
      )}
    </div>
  );
}
