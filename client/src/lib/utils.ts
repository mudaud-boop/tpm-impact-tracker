import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get date range presets
export function getDateRange(preset: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);

  switch (preset) {
    case 'Q1': {
      const year = now.getMonth() < 3 ? now.getFullYear() - 1 : now.getFullYear();
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 2, 31)
      };
    }
    case 'Q2': {
      const year = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
      return {
        start: new Date(year, 3, 1),
        end: new Date(year, 5, 30)
      };
    }
    case 'Q3': {
      const year = now.getMonth() < 9 ? now.getFullYear() - 1 : now.getFullYear();
      return {
        start: new Date(year, 6, 1),
        end: new Date(year, 8, 30)
      };
    }
    case 'Q4': {
      const year = now.getFullYear() - 1;
      return {
        start: new Date(year, 9, 1),
        end: new Date(year, 11, 31)
      };
    }
    case 'H1': {
      const year = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 5, 30)
      };
    }
    case 'H2': {
      const year = now.getFullYear() - 1;
      return {
        start: new Date(year, 6, 1),
        end: new Date(year, 11, 31)
      };
    }
    case 'YTD':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end
      };
    case '30d':
      return {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end
      };
    case '90d':
      return {
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end
      };
    default:
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end
      };
  }
}

// Craft Skill colors for charts - Intuit Brand Palette
export const PILLAR_COLORS: Record<string, string> = {
  // Shared craft skills
  'Connect Strategy to Execution': '#236CFF',  // super-blue
  'Execute with Rigor': '#3BD85E',             // kiwi-50
  'Enable Scale and Velocity': '#F9C741',      // honey-40
  'Lead Change': '#00254A',                    // blueberry-110
  // Job-family specific skills
  'Technical Domain Expertise': '#81F2FE',     // agave-30 (TPM)
  'Domain Expertise': '#FF5C37',               // tomato (PgM/PjM)
  'Solve Business Problems': '#C2F5FF'         // agave-10 (BizOps)
};

// Job family colors
export const JOB_FAMILY_COLORS: Record<string, string> = {
  TPM: '#236CFF',    // Super Blue
  PgM: '#3BD85E',    // Kiwi
  PjM: '#F9C741',    // Honey
  BizOps: '#00254A'  // Blueberry
};

// Category colors - Intuit Brand Palette
export const CATEGORY_COLORS: Record<string, string> = {
  'Risk Prevented': '#FF5C37',                 // tomato
  'Decision Accelerated': '#236CFF',           // super-blue
  'Launch Unblocked': '#3BD85E',               // kiwi-50
  'Time Saved': '#F9C741',                     // honey-40
  'Process Improved': '#003E31',               // spearmint-110
  'Change Delivered': '#81F2FE',               // agave-30
  'Technical Leadership': '#00254A'            // blueberry-110
};
