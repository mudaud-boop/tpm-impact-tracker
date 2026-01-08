import { useState, useEffect } from 'react';
import { FileText, Copy, Check, Calendar, Target, TrendingUp, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { getSummary } from '@/lib/api';
import { cn, PILLAR_COLORS } from '@/lib/utils';
import type { SummaryResponse } from '@/types';

type PresetKey = 'q1' | 'q2' | 'q3' | 'q4' | 'h1' | 'h2' | 'fy' | 'custom';

// Intuit Fiscal Year: Aug 1 - Jul 31
// FY is named after the year it ends (e.g., FY26 ends Jul 31, 2026)
const now = new Date();
const currentMonth = now.getMonth(); // 0-indexed
const currentCalYear = now.getFullYear();
// If we're in Aug-Dec, we're in the next FY; if Jan-Jul, we're in current year's FY
const currentFY = currentMonth >= 7 ? currentCalYear + 1 : currentCalYear;

const PRESETS: Record<PresetKey, { label: string; getRange: () => { start: string; end: string } }> = {
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
    getRange: () => ({
      start: '',
      end: ''
    })
  }
};

export function Summary() {
  const [selected, setSelected] = useState<PresetKey>('fy');
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState<'midyear' | 'endyear' | null>(null);

  async function handleGenerate(period?: PresetKey) {
    const currentPeriod = period || selected;
    let range: { start: string; end: string };

    if (currentPeriod === 'custom') {
      if (!customStart || !customEnd) {
        return; // Don't auto-generate for custom without dates
      }
      range = { start: customStart, end: customEnd };
    } else {
      range = PRESETS[currentPeriod].getRange();
    }

    setLoading(true);
    try {
      const result = await getSummary(range.start, range.end);
      setSummary(result);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate on mount and when period changes
  useEffect(() => {
    if (selected !== 'custom') {
      handleGenerate(selected);
    }
  }, [selected]);

  async function handleCopy() {
    if (!summary) return;

    const text = generatePlainText(summary);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function generatePlainText(data: SummaryResponse): string {
    let text = `TPM Impact Summary\n`;
    text += `Period: ${data.period.start} to ${data.period.end}\n`;
    text += `Total Impacts: ${data.totalImpacts}\n\n`;

    text += `=== BY PILLAR ===\n\n`;
    Object.entries(data.byPillar).forEach(([pillar, impacts]) => {
      if (impacts.length > 0) {
        text += `${pillar} (${impacts.length})\n`;
        impacts.forEach(impact => {
          text += `  • ${impact.title}`;
          if (impact.quantifiedValue && impact.quantifiedUnit) {
            text += ` [${impact.quantifiedValue} ${impact.quantifiedUnit}]`;
          }
          text += `\n`;
        });
        text += `\n`;
      }
    });

    if (Object.keys(data.quantifiedTotals).length > 0) {
      text += `=== QUANTIFIED TOTALS ===\n`;
      Object.entries(data.quantifiedTotals).forEach(([unit, total]) => {
        text += `  ${unit}: ${total}\n`;
      });
    }

    return text;
  }

  function handlePresetClick(key: PresetKey) {
    setSelected(key);
    if (key === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
    }
  }

  async function generatePDF(type: 'midyear' | 'endyear') {
    setGeneratingPdf(type);

    try {
      // Get the appropriate date range
      const range = type === 'midyear'
        ? PRESETS.h1.getRange()
        : PRESETS.fy.getRange();

      // Fetch the summary data for the period
      const data = await getSummary(range.start, range.end);

      // Create PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      // Helper function to add text and handle page breaks
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);

        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.5;

        lines.forEach((line: string) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      };

      const addSpace = (space: number) => {
        y += space;
        if (y > 270) {
          doc.addPage();
          y = margin;
        }
      };

      // Title
      const title = type === 'midyear'
        ? `Mid-Year Impact Summary - H1 FY${currentFY.toString().slice(-2)}`
        : `End-Year Impact Summary - FY${currentFY.toString().slice(-2)}`;

      addText(title, 20, true, [35, 108, 255]); // Intuit Super Blue
      addSpace(8);

      // Period
      addText(`Period: ${data.period.start} to ${data.period.end}`, 11, false, [100, 100, 100]);
      addSpace(4);
      addText(`Generated: ${new Date().toLocaleDateString()}`, 11, false, [100, 100, 100]);
      addSpace(12);

      // Overview Stats
      addText('SUMMARY OVERVIEW', 14, true);
      addSpace(6);
      addText(`Total Impacts: ${data.totalImpacts}`, 12);
      addText(`Craft Skills Covered: ${Object.values(data.byPillar).filter(arr => arr.length > 0).length}`, 12);
      addText(`Quantified Metrics: ${Object.keys(data.quantifiedTotals).length}`, 12);
      addSpace(12);

      // Quantified Totals (if any)
      if (Object.keys(data.quantifiedTotals).length > 0) {
        addText('QUANTIFIED TOTALS', 14, true);
        addSpace(6);
        Object.entries(data.quantifiedTotals).forEach(([unit, total]) => {
          addText(`• ${unit}: ${total}`, 11);
        });
        addSpace(12);
      }

      // Impacts by Pillar
      addText('IMPACTS BY CRAFT SKILL', 14, true);
      addSpace(8);

      Object.entries(data.byPillar).forEach(([pillar, impacts]) => {
        if (impacts.length > 0) {
          addSpace(4);
          addText(`${pillar} (${impacts.length})`, 12, true, [35, 108, 255]);
          addSpace(4);

          impacts.forEach(impact => {
            let impactText = `• ${impact.title}`;
            if (impact.quantifiedValue && impact.quantifiedUnit) {
              impactText += ` [${impact.quantifiedValue} ${impact.quantifiedUnit}]`;
            }
            addText(impactText, 10);
          });
          addSpace(4);
        }
      });

      // Footer
      addSpace(10);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      addSpace(6);
      addText('Generated by Impact Tracker', 9, false, [150, 150, 150]);

      // Save the PDF
      const filename = type === 'midyear'
        ? `Impact_Summary_H1_FY${currentFY.toString().slice(-2)}.pdf`
        : `Impact_Summary_FY${currentFY.toString().slice(-2)}.pdf`;

      doc.save(filename);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Impact Summary</h1>
        <p className="text-gray-500 mt-1">Generate a summary of your contributions</p>
      </div>

      {/* Period Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-medium">Select Period</h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(PRESETS) as PresetKey[]).map(key => (
            <button
              key={key}
              onClick={() => handlePresetClick(key)}
              className={cn(
                'px-4 py-2 rounded-md text-sm transition-colors',
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
          <div className="flex items-center gap-4 mb-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">From:</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">To:</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="input"
              />
            </div>
          </div>
        )}

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="btn btn-secondary flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>

      {/* Summary Output */}
      {summary && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-500" />
                Summary Overview
              </h3>
              <button
                onClick={handleCopy}
                className="btn btn-secondary text-sm flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-semibold text-gray-900">{summary.totalImpacts}</p>
                <p className="text-sm text-gray-500">Total Impacts</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-semibold text-gray-900">
                  {Object.values(summary.byPillar).filter(arr => arr.length > 0).length}
                </p>
                <p className="text-sm text-gray-500">Pillars Covered</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-semibold text-gray-900">
                  {Object.keys(summary.quantifiedTotals).length}
                </p>
                <p className="text-sm text-gray-500">Quantified Metrics</p>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Period: {summary.period.start} to {summary.period.end}
            </p>
          </div>

          {/* By Pillar */}
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-4">Impact by Pillar</h3>
            <div className="space-y-6">
              {Object.entries(summary.byPillar).map(([pillar, impacts]) => (
                impacts.length > 0 && (
                  <div key={pillar}>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PILLAR_COLORS[pillar] }}
                      />
                      <h4 className="font-medium text-gray-900">{pillar}</h4>
                      <span className="text-sm text-gray-500">({impacts.length})</span>
                    </div>
                    <ul className="space-y-2 pl-5">
                      {impacts.map((impact, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>
                            {impact.title}
                            {impact.quantifiedValue && impact.quantifiedUnit && (
                              <span className="ml-2 text-green-600 font-medium">
                                [{impact.quantifiedValue} {impact.quantifiedUnit}]
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Quantified Totals */}
          {Object.keys(summary.quantifiedTotals).length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Quantified Totals
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(summary.quantifiedTotals).map(([unit, total]) => (
                  <div key={unit} className="bg-green-50 rounded-lg p-4">
                    <p className="text-2xl font-semibold text-green-700">{total}</p>
                    <p className="text-sm text-green-600 capitalize">{unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!summary && !loading && (
        <div className="card p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No summary generated</h3>
          <p className="text-gray-500">Select a period and generate your impact summary</p>
        </div>
      )}

      {/* PDF Export Buttons */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-medium">Export PDF</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Generate a PDF report for performance reviews
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => generatePDF('midyear')}
            disabled={generatingPdf !== null}
            className="btn btn-primary flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {generatingPdf === 'midyear' ? 'Generating...' : `Mid-Year (H1 FY${currentFY.toString().slice(-2)})`}
          </button>
          <button
            onClick={() => generatePDF('endyear')}
            disabled={generatingPdf !== null}
            className="btn btn-primary flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {generatingPdf === 'endyear' ? 'Generating...' : `End-Year (FY${currentFY.toString().slice(-2)})`}
          </button>
        </div>
      </div>
    </div>
  );
}
