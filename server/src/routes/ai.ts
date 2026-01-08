import { Router } from 'express';
import { CATEGORY_PILLAR_MAP, TPM_PILLARS, IMPACT_CATEGORIES } from '../constants.js';

const router = Router();

// Mock AI classification - in future, replace with Claude API
router.post('/classify', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Simple keyword-based classification (mock)
    const lowerDesc = description.toLowerCase();

    let suggestedCategory = 'Process Improved';
    let suggestedPillars: string[] = [];

    // Risk-related keywords
    if (lowerDesc.includes('risk') || lowerDesc.includes('prevent') || lowerDesc.includes('avoid') || lowerDesc.includes('mitigat')) {
      suggestedCategory = 'Risk Prevented';
    }
    // Decision-related keywords
    else if (lowerDesc.includes('decision') || lowerDesc.includes('align') || lowerDesc.includes('stakeholder') || lowerDesc.includes('agreement')) {
      suggestedCategory = 'Decision Accelerated';
    }
    // Launch/unblock keywords
    else if (lowerDesc.includes('launch') || lowerDesc.includes('unblock') || lowerDesc.includes('blocker') || lowerDesc.includes('dependency')) {
      suggestedCategory = 'Launch Unblocked';
    }
    // Time savings keywords
    else if (lowerDesc.includes('automat') || lowerDesc.includes('save') || lowerDesc.includes('time') || lowerDesc.includes('efficien')) {
      suggestedCategory = 'Time Saved';
    }
    // Process keywords
    else if (lowerDesc.includes('process') || lowerDesc.includes('framework') || lowerDesc.includes('template') || lowerDesc.includes('standard')) {
      suggestedCategory = 'Process Improved';
    }
    // Change keywords
    else if (lowerDesc.includes('change') || lowerDesc.includes('transform') || lowerDesc.includes('adopt') || lowerDesc.includes('rollout')) {
      suggestedCategory = 'Change Delivered';
    }
    // Technical keywords
    else if (lowerDesc.includes('architect') || lowerDesc.includes('technical') || lowerDesc.includes('design') || lowerDesc.includes('system')) {
      suggestedCategory = 'Technical Leadership';
    }

    // Get suggested pillars based on category
    suggestedPillars = CATEGORY_PILLAR_MAP[suggestedCategory as keyof typeof CATEGORY_PILLAR_MAP] || [];

    // Suggest quantification based on keywords
    let quantificationPrompt = 'How would you quantify this impact?';
    if (lowerDesc.includes('week') || lowerDesc.includes('day') || lowerDesc.includes('time')) {
      quantificationPrompt = 'How many days/weeks were saved or prevented?';
    } else if (lowerDesc.includes('team') || lowerDesc.includes('people')) {
      quantificationPrompt = 'How many teams or people were impacted?';
    } else if (lowerDesc.includes('cost') || lowerDesc.includes('$') || lowerDesc.includes('dollar')) {
      quantificationPrompt = 'What was the dollar value of the impact?';
    }

    // Suggest metrics based on category
    const suggestedMetrics: string[] = [];
    if (suggestedCategory === 'Time Saved') {
      suggestedMetrics.push('hours saved', 'days saved', 'weeks saved');
    } else if (suggestedCategory === 'Risk Prevented') {
      suggestedMetrics.push('risks mitigated', 'incidents prevented');
    } else if (suggestedCategory === 'Launch Unblocked') {
      suggestedMetrics.push('teams unblocked', 'days saved');
    } else if (suggestedCategory === 'Decision Accelerated') {
      suggestedMetrics.push('decisions made', 'days saved');
    } else {
      suggestedMetrics.push('teams impacted', 'processes improved');
    }

    res.json({
      category: suggestedCategory,
      pillars: suggestedPillars,
      suggestedMetrics,
      confidence: 0.7 // Mock confidence score
    });
  } catch (error) {
    console.error('Error classifying:', error);
    res.status(500).json({ error: 'Failed to classify' });
  }
});

// Generate summary for a period
router.post('/summary', async (req, res) => {
  try {
    const { impacts } = req.body;

    if (!impacts || !Array.isArray(impacts)) {
      return res.status(400).json({ error: 'Impacts array is required' });
    }

    // Group by pillar
    const byPillar: Record<string, any[]> = {};
    TPM_PILLARS.forEach(pillar => {
      byPillar[pillar] = [];
    });

    impacts.forEach((impact: any) => {
      const pillars = impact.pillars || [];
      pillars.forEach((pillar: string) => {
        if (byPillar[pillar]) {
          byPillar[pillar].push(impact);
        }
      });
    });

    // Generate summary text
    let summaryText = '# Impact Summary\n\n';

    TPM_PILLARS.forEach(pillar => {
      const pillarImpacts = byPillar[pillar];
      if (pillarImpacts.length > 0) {
        summaryText += `## ${pillar}\n\n`;
        pillarImpacts.forEach((impact: any) => {
          summaryText += `- **${impact.title}**`;
          if (impact.quantifiedValue && impact.quantifiedUnit) {
            summaryText += ` (${impact.quantifiedValue} ${impact.quantifiedUnit})`;
          }
          summaryText += `\n  ${impact.description}\n\n`;
        });
      }
    });

    // Calculate totals
    const totalsByUnit: Record<string, number> = {};
    impacts.forEach((impact: any) => {
      if (impact.quantifiedValue && impact.quantifiedUnit) {
        const unit = impact.quantifiedUnit;
        totalsByUnit[unit] = (totalsByUnit[unit] || 0) + impact.quantifiedValue;
      }
    });

    if (Object.keys(totalsByUnit).length > 0) {
      summaryText += '## Quantified Impact\n\n';
      Object.entries(totalsByUnit).forEach(([unit, total]) => {
        summaryText += `- **${total} ${unit}**\n`;
      });
    }

    res.json({
      summary: summaryText,
      byPillar,
      totalsByUnit,
      totalImpacts: impacts.length
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export { router as aiRouter };
