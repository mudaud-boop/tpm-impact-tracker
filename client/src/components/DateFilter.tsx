import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateFilterProps {
  onChange: (range: { start?: string; end?: string }) => void;
}

type PresetKey = 'all' | 'q1' | 'q2' | 'q3' | 'q4' | 'h1' | 'h2' | 'fy' | 'custom';

// Intuit Fiscal Year: Aug 1 - Jul 31
// FY is named after the year it ends (e.g., FY26 ends Jul 31, 2026)
const now = new Date();
const currentMonth = now.getMonth(); // 0-indexed
const currentCalYear = now.getFullYear();
// If we're in Aug-Dec, we're in the next FY; if Jan-Jul, we're in current year's FY
const currentFY = currentMonth >= 7 ? currentCalYear + 1 : currentCalYear;

const PRESETS: Record<PresetKey, { label: string; getRange: () => { start?: string; end?: string } }> = {
  all: {
    label: 'All Time',
    getRange: () => ({})
  },
  q1: {
    label: 'Q1',
    // Aug 1 - Oct 31
    getRange: () => ({
      start: `${currentFY - 1}-08-01`,
      end: `${currentFY - 1}-10-31`
    })
  },
  q2: {
    label: 'Q2',
    // Nov 1 - Jan 31
    getRange: () => ({
      start: `${currentFY - 1}-11-01`,
      end: `${currentFY}-01-31`
    })
  },
  q3: {
    label: 'Q3',
    // Feb 1 - Apr 30
    getRange: () => ({
      start: `${currentFY}-02-01`,
      end: `${currentFY}-04-30`
    })
  },
  q4: {
    label: 'Q4',
    // May 1 - Jul 31
    getRange: () => ({
      start: `${currentFY}-05-01`,
      end: `${currentFY}-07-31`
    })
  },
  h1: {
    label: 'H1',
    // Aug 1 - Jan 31
    getRange: () => ({
      start: `${currentFY - 1}-08-01`,
      end: `${currentFY}-01-31`
    })
  },
  h2: {
    label: 'H2',
    // Feb 1 - Jul 31
    getRange: () => ({
      start: `${currentFY}-02-01`,
      end: `${currentFY}-07-31`
    })
  },
  fy: {
    label: `FY${currentFY.toString().slice(-2)}`,
    // Aug 1 - Jul 31
    getRange: () => ({
      start: `${currentFY - 1}-08-01`,
      end: `${currentFY}-07-31`
    })
  },
  custom: {
    label: 'Custom',
    getRange: () => ({})
  }
};

export function DateFilter({ onChange }: DateFilterProps) {
  const [selected, setSelected] = useState<PresetKey>('all');
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  function handlePresetClick(key: PresetKey) {
    setSelected(key);
    if (key === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onChange(PRESETS[key].getRange());
    }
  }

  function handleCustomApply() {
    if (customStart || customEnd) {
      onChange({
        start: customStart || undefined,
        end: customEnd || undefined
      });
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by Period</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(PRESETS) as PresetKey[]).map(key => (
          <button
            key={key}
            onClick={() => handlePresetClick(key)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              selected === key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">From:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="input text-sm py-1.5"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">To:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="input text-sm py-1.5"
            />
          </div>
          <button
            onClick={handleCustomApply}
            className="btn btn-primary text-sm py-1.5"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
