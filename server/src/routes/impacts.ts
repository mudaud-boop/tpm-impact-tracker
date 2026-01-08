import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Helper to parse JSON arrays from SQLite
const parseImpact = (impact: any) => ({
  ...impact,
  pillars: JSON.parse(impact.pillars || '[]'),
  programTags: JSON.parse(impact.programTags || '[]'),
  stakeholders: JSON.parse(impact.stakeholders || '[]'),
  evidenceLinks: JSON.parse(impact.evidenceLinks || '[]')
});

// Get all impacts with optional filters
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, pillar, category } = req.query;

    let where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (category) {
      where.impactCategory = category;
    }

    const impacts = await prisma.impact.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    let results = impacts.map(parseImpact);

    // Filter by pillar (need to do this in JS since it's stored as JSON string)
    if (pillar) {
      results = results.filter((impact: any) =>
        impact.pillars.includes(pillar as string)
      );
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching impacts:', error);
    res.status(500).json({ error: 'Failed to fetch impacts' });
  }
});

// Get single impact
router.get('/:id', async (req, res) => {
  try {
    const impact = await prisma.impact.findUnique({
      where: { id: req.params.id }
    });

    if (!impact) {
      return res.status(404).json({ error: 'Impact not found' });
    }

    res.json(parseImpact(impact));
  } catch (error) {
    console.error('Error fetching impact:', error);
    res.status(500).json({ error: 'Failed to fetch impact' });
  }
});

// Create impact
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      jobFamily,
      impactCategory,
      pillars,
      quantifiedValue,
      quantifiedUnit,
      date,
      programTags,
      stakeholders,
      evidenceLinks,
      source
    } = req.body;

    const impact = await prisma.impact.create({
      data: {
        title,
        description,
        jobFamily: jobFamily || 'TPM',
        impactCategory,
        pillars: JSON.stringify(pillars || []),
        quantifiedValue: quantifiedValue ? parseFloat(quantifiedValue) : null,
        quantifiedUnit: quantifiedUnit || null,
        date: new Date(date),
        programTags: JSON.stringify(programTags || []),
        stakeholders: JSON.stringify(stakeholders || []),
        evidenceLinks: JSON.stringify(evidenceLinks || []),
        source: source || 'web'
      }
    });

    res.status(201).json(parseImpact(impact));
  } catch (error) {
    console.error('Error creating impact:', error);
    res.status(500).json({ error: 'Failed to create impact' });
  }
});

// Update impact
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      jobFamily,
      impactCategory,
      pillars,
      quantifiedValue,
      quantifiedUnit,
      date,
      programTags,
      stakeholders,
      evidenceLinks
    } = req.body;

    const impact = await prisma.impact.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        jobFamily: jobFamily || 'TPM',
        impactCategory,
        pillars: JSON.stringify(pillars || []),
        quantifiedValue: quantifiedValue ? parseFloat(quantifiedValue) : null,
        quantifiedUnit: quantifiedUnit || null,
        date: new Date(date),
        programTags: JSON.stringify(programTags || []),
        stakeholders: JSON.stringify(stakeholders || []),
        evidenceLinks: JSON.stringify(evidenceLinks || [])
      }
    });

    res.json(parseImpact(impact));
  } catch (error) {
    console.error('Error updating impact:', error);
    res.status(500).json({ error: 'Failed to update impact' });
  }
});

// Delete impact
router.delete('/:id', async (req, res) => {
  try {
    await prisma.impact.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting impact:', error);
    res.status(500).json({ error: 'Failed to delete impact' });
  }
});

export { router as impactsRouter };
