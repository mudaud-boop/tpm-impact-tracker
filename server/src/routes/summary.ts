import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { TPM_PILLARS } from '../constants.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const where = {
      date: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    };

    const impacts = await prisma.impact.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    // Parse JSON fields
    const parsedImpacts = impacts.map(impact => ({
      ...impact,
      pillars: JSON.parse(impact.pillars || '[]') as string[]
    }));

    // Group by pillar
    const byPillar: Record<string, { title: string; quantifiedValue: number | null; quantifiedUnit: string | null }[]> = {};
    TPM_PILLARS.forEach(pillar => {
      byPillar[pillar] = [];
    });

    parsedImpacts.forEach(impact => {
      impact.pillars.forEach(pillar => {
        if (byPillar[pillar]) {
          byPillar[pillar].push({
            title: impact.title,
            quantifiedValue: impact.quantifiedValue,
            quantifiedUnit: impact.quantifiedUnit
          });
        }
      });
    });

    // Quantified totals
    const quantifiedTotals: Record<string, number> = {};
    parsedImpacts.forEach(impact => {
      if (impact.quantifiedValue && impact.quantifiedUnit) {
        quantifiedTotals[impact.quantifiedUnit] =
          (quantifiedTotals[impact.quantifiedUnit] || 0) + impact.quantifiedValue;
      }
    });

    res.json({
      period: { start: startDate, end: endDate },
      totalImpacts: impacts.length,
      byPillar,
      quantifiedTotals
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export { router as summaryRouter };
