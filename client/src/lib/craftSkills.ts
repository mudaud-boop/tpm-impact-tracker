// Intuit Program Management & Business Operations Craft Skills Framework
// Based on PgM & BizOps Craft Skills Rubric - FY25

export type JobFamily = 'TPM' | 'PgM' | 'PjM' | 'BizOps';

export type Level =
  | 'Manager'      // P2/T2
  | 'Senior'       // P3/T3 or M1
  | 'Staff'        // P4/T4 or M2
  | 'Sr. Staff'    // T5
  | 'Principal'    // P5/T6 or M3
  | 'Director'     // P6/M4 or Distinguished T7
  | 'VP';          // M6

export type Track = 'IC' | 'Manager';

export interface LevelInfo {
  name: Level;
  icGrade?: string;
  managerGrade?: string;
  description: string;
}

export interface SkillExpectation {
  level: Level;
  expectations: string[];
}

export interface CraftSkill {
  name: string;
  description: string;
  isShared: boolean;
  applicableTo: JobFamily[];
  expectations: Record<Level, string[]>;
}

// Job Family Definitions
export const JOB_FAMILIES: Record<JobFamily, { name: string; fullName: string; description: string }> = {
  TPM: {
    name: 'TPM',
    fullName: 'Technical Program Manager',
    description: 'Drives complex technical programs and initiatives, bridging engineering and business needs.'
  },
  PgM: {
    name: 'PgM',
    fullName: 'Program Manager',
    description: 'Manages cross-functional programs and strategic initiatives to deliver business outcomes.'
  },
  PjM: {
    name: 'PjM',
    fullName: 'Project Manager',
    description: 'Leads project execution with focus on delivery, timeline, and stakeholder management.'
  },
  BizOps: {
    name: 'BizOps',
    fullName: 'Business Operations',
    description: 'Drives operational excellence and solves complex business problems through data and process optimization.'
  }
};

// Level Definitions
export const LEVELS: LevelInfo[] = [
  {
    name: 'Manager',
    icGrade: 'P2/T2',
    description: 'Entry-level individual contributor focused on learning and executing defined tasks.'
  },
  {
    name: 'Senior',
    icGrade: 'P3/T3',
    managerGrade: 'M1',
    description: 'Experienced professional who works independently and may lead small initiatives.'
  },
  {
    name: 'Staff',
    icGrade: 'P4/T4',
    managerGrade: 'M2',
    description: 'Advanced professional who leads significant projects and mentors others.'
  },
  {
    name: 'Sr. Staff',
    icGrade: 'T5',
    description: 'Expert IC who drives complex initiatives and influences beyond immediate team.'
  },
  {
    name: 'Principal',
    icGrade: 'P5/T6',
    managerGrade: 'M3',
    description: 'Senior leader who shapes strategy and drives org-wide impact.'
  },
  {
    name: 'Director',
    icGrade: 'T7 (Distinguished)',
    managerGrade: 'P6/M4',
    description: 'Executive leader who sets direction for major business areas.'
  },
  {
    name: 'VP',
    managerGrade: 'M6',
    description: 'Executive responsible for large organizations and company-wide strategy.'
  }
];

// Shared Craft Skills (applicable to all job families)
export const SHARED_CRAFT_SKILLS: CraftSkill[] = [
  {
    name: 'Connect Strategy to Execution',
    description: 'Translates strategic vision into actionable plans and ensures alignment across teams.',
    isShared: true,
    applicableTo: ['TPM', 'PgM', 'PjM', 'BizOps'],
    expectations: {
      'Manager': [
        'Understands team goals and how they connect to broader business objectives',
        'Aligns daily work to team priorities and OKRs',
        'Asks clarifying questions to understand the "why" behind tasks',
        'Communicates progress and blockers to stakeholders'
      ],
      'Senior': [
        'Translates program objectives into clear milestones and deliverables',
        'Ensures team activities align with strategic priorities',
        'Identifies misalignments between strategy and execution early',
        'Facilitates discussions to resolve conflicting priorities',
        'Creates clear documentation connecting work to business outcomes'
      ],
      'Staff': [
        'Develops program strategies that directly support business unit goals',
        'Influences roadmap decisions based on strategic understanding',
        'Proactively identifies strategic gaps and proposes solutions',
        'Drives cross-team alignment on complex initiatives',
        'Mentors others on connecting daily work to strategy'
      ],
      'Sr. Staff': [
        'Shapes strategy for major product areas or platforms',
        'Drives alignment across multiple teams and stakeholders',
        'Anticipates strategic shifts and prepares teams accordingly',
        'Influences executive decisions with data-driven insights',
        'Creates frameworks for strategy-execution alignment'
      ],
      'Principal': [
        'Defines strategy for large-scale, multi-year programs',
        'Aligns multiple organizations around shared strategic goals',
        'Advises executives on strategic trade-offs and priorities',
        'Drives organizational change to improve strategy execution',
        'Represents program strategy to external stakeholders'
      ],
      'Director': [
        'Sets strategic direction for major business areas',
        'Ensures organizational alignment with company strategy',
        'Makes high-impact decisions that shape business direction',
        'Builds organizational capabilities for strategic execution',
        'Partners with executives to define company strategy'
      ],
      'VP': [
        'Defines and drives company-wide strategic initiatives',
        'Ensures enterprise-wide alignment on strategic priorities',
        'Shapes industry direction through thought leadership',
        'Builds organizational culture focused on strategic execution',
        'Represents company strategy to board and external stakeholders'
      ]
    }
  },
  {
    name: 'Execute with Rigor',
    description: 'Delivers results through disciplined planning, tracking, and problem-solving.',
    isShared: true,
    applicableTo: ['TPM', 'PgM', 'PjM', 'BizOps'],
    expectations: {
      'Manager': [
        'Follows established processes and methodologies',
        'Tracks and reports on task completion and milestones',
        'Escalates blockers and risks in a timely manner',
        'Maintains accurate documentation and status updates',
        'Meets committed deadlines consistently'
      ],
      'Senior': [
        'Creates and maintains detailed project plans',
        'Proactively identifies and mitigates risks',
        'Drives effective meetings and decision-making',
        'Holds team members accountable to commitments',
        'Implements process improvements within team scope'
      ],
      'Staff': [
        'Designs and implements program execution frameworks',
        'Manages complex dependencies across multiple teams',
        'Creates risk management strategies for large programs',
        'Drives accountability across cross-functional teams',
        'Establishes metrics and dashboards for program health'
      ],
      'Sr. Staff': [
        'Leads execution of high-complexity, high-stakes programs',
        'Develops organization-wide execution standards',
        'Resolves escalated issues with minimal executive involvement',
        'Creates playbooks for repeatable program execution',
        'Coaches others on execution excellence'
      ],
      'Principal': [
        'Ensures rigorous execution across multiple large programs',
        'Establishes execution governance for the organization',
        'Drives continuous improvement in execution practices',
        'Manages executive stakeholder expectations effectively',
        'Builds teams capable of executing complex programs'
      ],
      'Director': [
        'Sets execution standards for the organization',
        'Ensures consistent delivery across all programs',
        'Builds organizational muscle for rigorous execution',
        'Makes critical trade-off decisions for major programs',
        'Holds senior leaders accountable for delivery'
      ],
      'VP': [
        'Defines company-wide execution standards and governance',
        'Ensures consistent delivery of strategic initiatives',
        'Builds execution capabilities across the organization',
        'Drives culture of accountability and results',
        'Reports on strategic execution to board and executives'
      ]
    }
  },
  {
    name: 'Enable Scale and Velocity',
    description: 'Improves efficiency and enables faster delivery through process optimization and automation.',
    isShared: true,
    applicableTo: ['TPM', 'PgM', 'PjM', 'BizOps'],
    expectations: {
      'Manager': [
        'Identifies repetitive tasks that could be automated',
        'Follows and improves existing processes',
        'Documents learnings and best practices',
        'Shares knowledge within the team',
        'Adopts tools and practices that improve efficiency'
      ],
      'Senior': [
        'Implements process improvements that increase team velocity',
        'Creates templates and tools for common tasks',
        'Identifies bottlenecks and proposes solutions',
        'Drives adoption of productivity tools and practices',
        'Measures and reports on efficiency improvements'
      ],
      'Staff': [
        'Designs scalable processes for cross-team programs',
        'Implements automation for program management tasks',
        'Creates frameworks that accelerate program delivery',
        'Drives organizational adoption of best practices',
        'Quantifies and communicates velocity improvements'
      ],
      'Sr. Staff': [
        'Architects systems and processes for organizational scale',
        'Drives automation initiatives across multiple teams',
        'Creates self-service tools and platforms',
        'Influences tool and process decisions at org level',
        'Mentors others on building scalable solutions'
      ],
      'Principal': [
        'Defines scaling strategy for major business areas',
        'Drives enterprise-wide efficiency initiatives',
        'Builds organizational capabilities for scale',
        'Makes investment decisions for scaling infrastructure',
        'Partners with engineering on automation platforms'
      ],
      'Director': [
        'Sets organizational strategy for scale and efficiency',
        'Ensures consistent processes across all programs',
        'Builds teams focused on continuous improvement',
        'Makes strategic investments in scaling capabilities',
        'Drives cultural shift toward operational excellence'
      ],
      'VP': [
        'Defines company-wide strategy for operational scale',
        'Ensures enterprise capabilities support rapid growth',
        'Builds organizational culture of continuous improvement',
        'Makes strategic investments in operational infrastructure',
        'Drives industry-leading operational excellence'
      ]
    }
  },
  {
    name: 'Lead Change',
    description: 'Drives organizational transformation and helps teams navigate through change effectively.',
    isShared: true,
    applicableTo: ['TPM', 'PgM', 'PjM', 'BizOps'],
    expectations: {
      'Manager': [
        'Embraces change and maintains positive attitude',
        'Helps teammates adapt to new processes',
        'Communicates change impacts clearly to stakeholders',
        'Provides feedback on change effectiveness',
        'Documents learnings from change initiatives'
      ],
      'Senior': [
        'Leads change initiatives within team scope',
        'Creates communication plans for changes',
        'Identifies and addresses resistance to change',
        'Measures adoption and effectiveness of changes',
        'Coaches team members through transitions'
      ],
      'Staff': [
        'Designs and leads significant change initiatives',
        'Creates change management frameworks',
        'Builds coalitions to support organizational changes',
        'Manages stakeholder expectations during transitions',
        'Drives cultural shifts within program scope'
      ],
      'Sr. Staff': [
        'Leads transformational change across multiple teams',
        'Influences organizational culture and ways of working',
        'Develops change leaders within the organization',
        'Creates sustainable change management practices',
        'Navigates complex political landscapes during change'
      ],
      'Principal': [
        'Drives major organizational transformations',
        'Shapes organizational culture and values',
        'Builds organizational change capabilities',
        'Advises executives on change strategy',
        'Ensures change initiatives deliver intended outcomes'
      ],
      'Director': [
        'Sets direction for organizational transformation',
        'Builds change-ready organizations',
        'Makes strategic decisions about organizational evolution',
        'Holds leaders accountable for change outcomes',
        'Partners with HR and executives on culture change'
      ],
      'VP': [
        'Defines company-wide transformation agenda',
        'Shapes company culture and values',
        'Builds enterprise capabilities for continuous change',
        'Represents transformation progress to board',
        'Drives industry-leading organizational practices'
      ]
    }
  }
];

// Job-Family Specific Craft Skills
export const JOB_SPECIFIC_CRAFT_SKILLS: CraftSkill[] = [
  {
    name: 'Technical Domain Expertise',
    description: 'Deep understanding of technical systems, architecture, and engineering practices.',
    isShared: false,
    applicableTo: ['TPM'],
    expectations: {
      'Manager': [
        'Understands basic technical concepts and terminology',
        'Can read and interpret technical documentation',
        'Asks relevant technical questions to understand systems',
        'Learns about team\'s technical stack and architecture',
        'Communicates technical concepts to non-technical stakeholders'
      ],
      'Senior': [
        'Deep understanding of team\'s technical systems',
        'Can evaluate technical proposals and trade-offs',
        'Identifies technical risks and dependencies',
        'Facilitates technical discussions and decisions',
        'Translates business requirements into technical needs'
      ],
      'Staff': [
        'Expert in domain-specific technical systems',
        'Influences technical architecture decisions',
        'Drives technical standards within program scope',
        'Mentors others on technical domain knowledge',
        'Partners with engineering leads on technical strategy'
      ],
      'Sr. Staff': [
        'Recognized expert across multiple technical domains',
        'Shapes technical direction for major platforms',
        'Drives adoption of technical best practices',
        'Advises on complex technical trade-offs',
        'Builds technical capabilities within the organization'
      ],
      'Principal': [
        'Sets technical strategy for large program areas',
        'Influences company-wide technical decisions',
        'Drives technical innovation and transformation',
        'Builds organizational technical expertise',
        'Represents technical perspective to executives'
      ],
      'Director': [
        'Defines technical direction for major business areas',
        'Ensures technical excellence across organization',
        'Makes strategic technical investment decisions',
        'Builds world-class technical PM capabilities',
        'Partners with CTO/VPE on technical strategy'
      ],
      'VP': [
        'Shapes company-wide technical strategy',
        'Ensures technical capabilities support business goals',
        'Drives industry-leading technical practices',
        'Builds organizational technical excellence',
        'Represents technical strategy to board'
      ]
    }
  },
  {
    name: 'Domain Expertise',
    description: 'Deep understanding of business domain, market dynamics, and industry practices.',
    isShared: false,
    applicableTo: ['PgM', 'PjM'],
    expectations: {
      'Manager': [
        'Learns business domain fundamentals',
        'Understands customer needs and pain points',
        'Stays current on industry trends',
        'Asks questions to deepen domain knowledge',
        'Applies domain knowledge to daily work'
      ],
      'Senior': [
        'Deep understanding of business domain',
        'Anticipates market and customer trends',
        'Applies domain expertise to program decisions',
        'Shares domain knowledge with team',
        'Builds relationships with domain experts'
      ],
      'Staff': [
        'Recognized domain expert within organization',
        'Influences product and business decisions',
        'Drives domain-specific best practices',
        'Mentors others on domain knowledge',
        'Represents domain perspective to stakeholders'
      ],
      'Sr. Staff': [
        'Expert across multiple business domains',
        'Shapes domain strategy for major areas',
        'Drives domain innovation and transformation',
        'Builds domain expertise within organization',
        'Advises executives on domain trends'
      ],
      'Principal': [
        'Sets domain strategy for business areas',
        'Influences company-wide domain decisions',
        'Drives industry-leading domain practices',
        'Builds organizational domain capabilities',
        'Represents domain expertise externally'
      ],
      'Director': [
        'Defines domain direction for major business areas',
        'Ensures domain excellence across organization',
        'Makes strategic domain investment decisions',
        'Builds world-class domain expertise',
        'Partners with executives on domain strategy'
      ],
      'VP': [
        'Shapes company-wide domain strategy',
        'Ensures domain capabilities support business goals',
        'Drives industry thought leadership',
        'Builds organizational domain excellence',
        'Represents domain strategy to board'
      ]
    }
  },
  {
    name: 'Solve Business Problems',
    description: 'Identifies, analyzes, and solves complex business problems through data-driven approaches.',
    isShared: false,
    applicableTo: ['BizOps'],
    expectations: {
      'Manager': [
        'Identifies business problems within scope',
        'Gathers and analyzes relevant data',
        'Proposes solutions based on analysis',
        'Implements solutions with guidance',
        'Measures solution effectiveness'
      ],
      'Senior': [
        'Independently identifies and solves business problems',
        'Conducts thorough root cause analysis',
        'Develops data-driven recommendations',
        'Implements solutions across team boundaries',
        'Creates frameworks for problem-solving'
      ],
      'Staff': [
        'Solves complex, ambiguous business problems',
        'Drives strategic analysis initiatives',
        'Creates problem-solving methodologies',
        'Influences business decisions with insights',
        'Mentors others on analytical approaches'
      ],
      'Sr. Staff': [
        'Tackles highest-complexity business challenges',
        'Shapes problem-solving approaches for organization',
        'Drives data-driven culture',
        'Advises executives on strategic problems',
        'Builds analytical capabilities in teams'
      ],
      'Principal': [
        'Defines strategic problem-solving agenda',
        'Drives enterprise-wide analytical initiatives',
        'Builds organizational problem-solving capabilities',
        'Makes high-impact business recommendations',
        'Partners with executives on strategic challenges'
      ],
      'Director': [
        'Sets direction for business problem-solving',
        'Ensures analytical excellence across organization',
        'Makes strategic investment decisions',
        'Builds world-class BizOps capabilities',
        'Partners with executives on business strategy'
      ],
      'VP': [
        'Defines company-wide BizOps strategy',
        'Ensures analytical capabilities support growth',
        'Drives industry-leading operational practices',
        'Builds organizational analytical excellence',
        'Represents operational strategy to board'
      ]
    }
  }
];

// Helper function to get all skills for a job family
export function getSkillsForJobFamily(jobFamily: JobFamily): CraftSkill[] {
  return [
    ...SHARED_CRAFT_SKILLS,
    ...JOB_SPECIFIC_CRAFT_SKILLS.filter(skill => skill.applicableTo.includes(jobFamily))
  ];
}

// Helper function to get specific skill for a job family
export function getJobSpecificSkill(jobFamily: JobFamily): CraftSkill | undefined {
  return JOB_SPECIFIC_CRAFT_SKILLS.find(skill => skill.applicableTo.includes(jobFamily));
}

// Helper to get level info by name
export function getLevelInfo(level: Level): LevelInfo | undefined {
  return LEVELS.find(l => l.name === level);
}

// Colors for job families
export const JOB_FAMILY_COLORS: Record<JobFamily, string> = {
  TPM: '#236CFF',    // Super Blue
  PgM: '#3BD85E',    // Kiwi
  PjM: '#F9C741',    // Honey
  BizOps: '#00254A'  // Blueberry
};

// Colors for craft skills
export const CRAFT_SKILL_COLORS: Record<string, string> = {
  'Connect Strategy to Execution': '#236CFF',
  'Execute with Rigor': '#3BD85E',
  'Enable Scale and Velocity': '#F9C741',
  'Lead Change': '#00254A',
  'Technical Domain Expertise': '#81F2FE',
  'Domain Expertise': '#FF5C37',
  'Solve Business Problems': '#C2F5FF'
};
