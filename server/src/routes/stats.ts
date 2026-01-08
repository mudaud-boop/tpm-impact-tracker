import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { TPM_PILLARS, IMPACT_CATEGORIES } from '../constants.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let where: any = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const impacts = await prisma.impact.findMany({ where });

    // Parse JSON fields
    const parsedImpacts = impacts.map(impact => ({
      ...impact,
      pillars: JSON.parse(impact.pillars || '[]')
    }));

    // Count by pillar
    const byPillar: Record<string, number> = {};
    TPM_PILLARS.forEach(pillar => {
      byPillar[pillar] = 0;
    });

    parsedImpacts.forEach(impact => {
      impact.pillars.forEach((pillar: string) => {
        if (byPillar[pillar] !== undefined) {
          byPillar[pillar]++;
        }
      });
    });

    // Count by category
    const byCategory: Record<string, number> = {};
    IMPACT_CATEGORIES.forEach(cat => {
      byCategory[cat] = 0;
    });

    parsedImpacts.forEach(impact => {
      if (byCategory[impact.impactCategory] !== undefined) {
        byCategory[impact.impactCategory]++;
      }
    });

    // Quantified totals by unit
    const quantifiedTotals: Record<string, number> = {};
    parsedImpacts.forEach(impact => {
      if (impact.quantifiedValue && impact.quantifiedUnit) {
        const unit = impact.quantifiedUnit;
        quantifiedTotals[unit] = (quantifiedTotals[unit] || 0) + impact.quantifiedValue;
      }
    });

    // Monthly trend (last 6 months)
    const monthlyTrend: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = month.toISOString().slice(0, 7); // YYYY-MM
      monthlyTrend[key] = 0;
    }

    parsedImpacts.forEach(impact => {
      const key = impact.date.toISOString().slice(0, 7);
      if (monthlyTrend[key] !== undefined) {
        monthlyTrend[key]++;
      }
    });

    res.json({
      totalImpacts: impacts.length,
      byPillar,
      byCategory,
      quantifiedTotals,
      monthlyTrend,
      // Pillar coverage (percentage)
      pillarCoverage: Object.fromEntries(
        Object.entries(byPillar).map(([pillar, count]) => [
          pillar,
          impacts.length > 0 ? Math.round((count / impacts.length) * 100) : 0
        ])
      )
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export { router as statsRouter };
