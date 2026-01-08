import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Calendar, Tag, Users, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { deleteImpact } from '@/lib/api';
import { formatDate, cn, PILLAR_COLORS, CATEGORY_COLORS, JOB_FAMILY_COLORS } from '@/lib/utils';
import type { Impact } from '@/types';

interface ImpactCardProps {
  impact: Impact;
  onDelete: () => void;
}

export function ImpactCard({ impact, onDelete }: ImpactCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this impact?')) return;

    setDeleting(true);
    try {
      await deleteImpact(impact.id);
      onDelete();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete impact');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            {impact.jobFamily && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${JOB_FAMILY_COLORS[impact.jobFamily]}15`,
                  color: JOB_FAMILY_COLORS[impact.jobFamily]
                }}
              >
                {impact.jobFamily}
              </span>
            )}
            <span
              className="badge"
              style={{
                backgroundColor: `${CATEGORY_COLORS[impact.impactCategory]}15`,
                color: CATEGORY_COLORS[impact.impactCategory],
                borderColor: `${CATEGORY_COLORS[impact.impactCategory]}30`
              }}
            >
              {impact.impactCategory}
            </span>
            {impact.quantifiedValue && impact.quantifiedUnit && (
              <span className="badge badge-success">
                {impact.quantifiedValue} {impact.quantifiedUnit}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900 mb-1">{impact.title}</h3>

          {/* Description */}
          <p className={cn(
            "text-gray-600 text-sm",
            !expanded && "line-clamp-2"
          )}>
            {impact.description}
          </p>

          {/* Pillars */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {impact.pillars.map(pillar => (
              <span
                key={pillar}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${PILLAR_COLORS[pillar]}15`,
                  color: PILLAR_COLORS[pillar]
                }}
              >
                {pillar}
              </span>
            ))}
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              {impact.programTags.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span>{impact.programTags.join(', ')}</span>
                </div>
              )}
              {impact.stakeholders.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{impact.stakeholders.join(', ')}</span>
                </div>
              )}
              {impact.evidenceLinks.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <LinkIcon className="h-4 w-4" />
                  <div className="flex flex-wrap gap-2">
                    {impact.evidenceLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline"
                      >
                        Link {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(impact.date)}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-primary-500 hover:text-primary-600"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  More
                </>
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            to={`/edit/${impact.id}`}
            className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
