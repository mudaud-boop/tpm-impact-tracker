// Rubric expectations by Craft Skill, Level, and Job Family
// Based on Intuit's PgM & BizOps Craft Skills Rubric FY25

export type Level = 'Manager' | 'Senior' | 'Staff' | 'Sr. Staff' | 'Principal' | 'Director' | 'VP';
export type CraftSkill =
  | 'Connect Strategy to Execution'
  | 'Execute with Rigor'
  | 'Enable Scale and Velocity'
  | 'Lead Change'
  | 'Technical Domain Expertise'
  | 'Domain Expertise'
  | 'Solve Business Problems';

export interface RubricExpectation {
  id: string;
  text: string;
}

// Shared craft skills (all job families use these)
const CONNECT_STRATEGY_TO_EXECUTION: Record<Level, RubricExpectation[]> = {
  'Manager': [
    { id: 'cse-m-1', text: 'Is familiar with the organizational strategy, business/operating model and performance drivers, and uses this as an input to deliver on the strategy at project/program/process level' },
    { id: 'cse-m-2', text: 'Helps prioritize within a project/program/process to accelerate delivery of the most impactful work' },
    { id: 'cse-m-3', text: 'Identifies when a decision or tradeoff is needed and comes up with data driven recommendations to stakeholders for decisioning, with guidance' }
  ],
  'Senior': [
    { id: 'cse-s-1', text: 'Understands the organizational strategy, business/operating model and performance drivers, and uses this as an input to contribute to and deliver on the strategy at project/program/process level' },
    { id: 'cse-s-2', text: 'Prioritizes within a project/program/process across teams to accelerate delivery of the most impactful work' },
    { id: 'cse-s-3', text: 'Identifies when a decision or tradeoff is needed and able to come up with data driven recommendations to stakeholders for decisioning independently' }
  ],
  'Staff': [
    { id: 'cse-st-1', text: 'Demonstrates in-depth understanding of the organizational and Intuit strategy, business/operating model and performance drivers, and uses this as an input to facilitate the creation of strategy and drive execution to deliver on the strategy at project/program/process level' },
    { id: 'cse-st-2', text: 'Prioritizes within a project/program/process across multiple organizations or in a large function/segment to accelerate delivery of the most impactful work' },
    { id: 'cse-st-3', text: 'Identifies when a decision or tradeoff is needed, drives tradeoff discussions and provides data driven recommendations to stakeholders for decisioning' }
  ],
  'Sr. Staff': [
    { id: 'cse-ss-1', text: 'Demonstrates awareness of business outcomes and in-depth understanding of the organizational and Intuit strategy, business/operating model and performance drivers, and uses this as an input to facilitate the creation of strategy and drive execution to deliver on the strategy at project/program/process level' },
    { id: 'cse-ss-2', text: 'Prioritizes across multiple programs or within a complex program to accelerate delivery of the most impactful work' },
    { id: 'cse-ss-3', text: 'Identifies when a decision or tradeoff is needed, drives trade-off discussions, assesses options that impact the portfolio, provides data-driven recommendations and aligns leaders' }
  ],
  'Principal': [
    { id: 'cse-p-1', text: 'Demonstrates in-depth understanding of the business outcomes and industry trends, organizational and Intuit strategy, business/operating model and performance drivers, and uses this as an input to facilitate the creation of strategy and drive execution to deliver on the strategy at project/program/process/portfolio level' },
    { id: 'cse-p-2', text: 'Prioritizes within a portfolio or a large-scale, complex project/program/process to accelerate delivery of the business outcomes and influences the overall prioritization across portfolios' },
    { id: 'cse-p-3', text: 'Identifies when a decision or tradeoff is needed, assesses options and provides principled and data-driven recommendations to drive effective decision making across the portfolio or a large-scale, complex project/program/process' }
  ],
  'Director': [
    { id: 'cse-d-1', text: 'Expert in connecting organizational strategy, business outcomes, business/operating model and performance drivers, with in-depth understanding of external environment and industry trends, in order to lead strategic planning and drive strategy execution in a large segment/function or at the company level' },
    { id: 'cse-d-2', text: 'Prioritizes across multiple portfolios or large-scale, complex projects/programs/processes to accelerate the delivery of the business outcomes' },
    { id: 'cse-d-3', text: 'Identifies when a decision or tradeoff is needed, assesses options and provides principled and data driven recommendations to stakeholders to drive effective decision making across portfolios or multiple large-scale, complex projects/programs/processes, taking into consideration the impact of decisions beyond the portfolio' }
  ],
  'VP': [
    { id: 'cse-v-1', text: 'Defines and cascades strategy and champions major strategic change initiatives, business outcomes and performance drivers for company-level impact, considering the evolving business and technology landscape, both internal and external' },
    { id: 'cse-v-2', text: 'Creates the environment for effective and speedy prioritization across Intuit' },
    { id: 'cse-v-3', text: 'Makes decisions or tradeoffs by assessing options and their impact across multiple organizations or across Intuit, while leveraging a principled and data-driven approach, bringing along senior leaders across organizations or portfolios' }
  ]
};

const EXECUTE_WITH_RIGOR: Record<Level, RubricExpectation[]> = {
  'Manager': [
    { id: 'ewr-m-1', text: 'Develops and executes a high quality plan with clear milestones and well-defined success measures to deliver the business outcomes' },
    { id: 'ewr-m-2', text: 'Contributes to elements of operating rhythm at project/program/process level to set strategy, monitor performance, inspire teams and instill accountability' },
    { id: 'ewr-m-3', text: 'Understands risks and dependencies for the work and proactively escalates blockers. Communicates clearly on work progress, leveraging data to inform trends, decisions and next steps' }
  ],
  'Senior': [
    { id: 'ewr-s-1', text: 'Develops and executes a high quality plan with clear milestones and well-defined success measures, that can adapt to change, in order to deliver the business outcomes' },
    { id: 'ewr-s-2', text: 'Drives operating rhythm at project/program/process level to set strategy, monitor performance, inspire teams and instill accountability' },
    { id: 'ewr-s-3', text: 'Helps uncover risks and dependencies, proactively escalates blockers and determines the optimal paths to green. Communicates clearly on program progress, leveraging data to inform trends, decisions and next steps' }
  ],
  'Staff': [
    { id: 'ewr-st-1', text: 'Partners across teams to define program outcomes, create program framework, build an end to end delivery plan and establish governance model. Leads appropriate workstream drivers to meet program success measures, in order to deliver business outcomes' },
    { id: 'ewr-st-2', text: 'Develops and drives the operating rhythm at the project/program/process level to set strategy, monitor performance, inspire teams and instill accountability' },
    { id: 'ewr-st-3', text: 'Partners across teams to uncover risks and dependencies, proactively escalates blockers and quickly determines the optimal paths to green. Communicates clearly on program progress, leveraging data and insights to recommend decisions and next steps. Is curious and resourceful with solutions' }
  ],
  'Sr. Staff': [
    { id: 'ewr-ss-1', text: 'Leads teams to define program outcomes, create program framework, builds end to end delivery plans and establish governance model for complex programs. Leads appropriate workstream drivers to meet program success measures, in order to deliver business outcomes' },
    { id: 'ewr-ss-2', text: 'Develops and drives the operating rhythm of complex projects/programs/processes to set strategy, monitor performance, inspire teams and instill accountability' },
    { id: 'ewr-ss-3', text: 'Leads teams to identify risks and dependencies upfront and quickly determines optimal paths to green. Communicates clearly on program progress, trends, and insights to influence strategic changes and adjustments to plan. Is curious and resourceful with solutions and operationalizes creative ways to execute' }
  ],
  'Principal': [
    { id: 'ewr-p-1', text: 'Leads teams to define program outcomes, create program framework, build end to end delivery plans and establish governance model for large-scale, complex programs. Leads and motivates teams to execute against the plan, in order to deliver business outcomes' },
    { id: 'ewr-p-2', text: 'Develops and drives the operating rhythm at the organizational level to set strategy, monitor performance, inspire teams and instill accountability. Creates an environment of rigor for teams to collaborate with clarity on accountability, outcomes and success measures' },
    { id: 'ewr-p-3', text: 'Leads teams to identify risks and dependencies upfront, quickly determines optimal paths to green and provides recommendations that optimize program delivery. Communicates clearly on program progress, trends, insights and predicted performance to stakeholders with a clear narrative on the need for strategic changes and adjustments to plan' }
  ],
  'Director': [
    { id: 'ewr-d-1', text: 'Develops a high quality portfolio management plan with clear owners across multiple organizations, in a large segment/function or at the company level. Partners with senior leaders to improve overall portfolio delivery for Intuit' },
    { id: 'ewr-d-2', text: 'Owns the operating rhythm at the organizational level to set strategy, monitor performance, inspire teams and instill accountability. Leads and builds teams to improve operational rigor to ensure clarity on accountability, outcomes and success measures' },
    { id: 'ewr-d-3', text: 'Identifies portfolio level risk/issues, uses creativity and resourcefulness to operationalize solutions and influences the response plan across multiple domains. Develops a reporting structure that provides the right level of detail across the portfolio on progress, trends, insights and predicted performance, surfacing the need of strategic changes and adjustments to plan' }
  ],
  'VP': [
    { id: 'ewr-v-1', text: 'Establishes cross-functional priorities up to Intuit-level and delivers on a high quality portfolio management plan, partnering with senior leaders across the company' },
    { id: 'ewr-v-2', text: 'Leads, builds and empowers team to execute with operational rigor at any level including Intuit-wide to ensure clarity on accountability, outcomes and success measures' },
    { id: 'ewr-v-3', text: 'Maintains a clear view of portfolio health and performance vs. plan, emphasizing or escalating the need for strategic changes and adjustments if the external landscape or business priorities so warrant. Looks around the corners, anticipating changes, risks or issues to fast execution of decisions and proactively removes obstacles blocking teams' }
  ]
};

const ENABLE_SCALE_AND_VELOCITY: Record<Level, RubricExpectation[]> = {
  'Manager': [
    { id: 'esv-m-1', text: 'Leverages proven frameworks, best practices, tools, and templates' },
    { id: 'esv-m-2', text: 'Contributes to the identification of continuous improvement opportunities and executes on those areas of improvement' },
    { id: 'esv-m-3', text: 'Participates in craft development opportunities' }
  ],
  'Senior': [
    { id: 'esv-s-1', text: 'Leverages proven frameworks and contributes to best practices, tools, and templates' },
    { id: 'esv-s-2', text: 'Identifies, recommends and drives continuous improvement opportunities to ensure outcome delivery and improve business efficiency' },
    { id: 'esv-s-3', text: 'Participates in the improvement of the craft and coaches others on the fundamentals of Program Management and Business Operations' }
  ],
  'Staff': [
    { id: 'esv-st-1', text: 'Identifies the need and contributes to new frameworks, best practices, tools, and templates or leverages existing ones' },
    { id: 'esv-st-2', text: 'Identifies, recommends and drives continuous improvement opportunities to ensure outcome delivery and improve business efficiency. Tests with rapid experimentation and shares learnings to enable improvement in other areas' },
    { id: 'esv-st-3', text: 'Participates in the improvement of the craft, is viewed by peers as an expert and coaches others' }
  ],
  'Sr. Staff': [
    { id: 'esv-ss-1', text: 'Defines and implements proven frameworks, best practices, tools, and templates that are repeatable, durable and scalable' },
    { id: 'esv-ss-2', text: 'Identifies, recommends and drives continuous improvement opportunities to ensure outcome delivery and improve business efficiency. Tests with rapid experimentation, shares learnings broadly and scales through others' },
    { id: 'esv-ss-3', text: 'Drives craft development, is viewed by peers as an expert and contributes to create an environment where Program Managers and Business Operations can do the best work of their lives' }
  ],
  'Principal': [
    { id: 'esv-p-1', text: 'Defines, implements and proactively drives adoption of proven frameworks, best practices, tools, and templates that are repeatable, durable and scalable' },
    { id: 'esv-p-2', text: 'Identifies, recommends and drives continuous improvement opportunities to ensure outcome delivery and improve business efficiency. Tests with rapid experimentation, shares learnings across the community and drives areas of improvement at scale. Amplifies impact by challenging status quo and scaling through others' },
    { id: 'esv-p-3', text: 'Drives craft development, is viewed as a thought leader and coaches leaders to create an environment where Program Managers and Business Operations can do the best work of their lives' }
  ],
  'Director': [
    { id: 'esv-d-1', text: 'Defines, implements and champions proven frameworks, best practices, tools and templates that are repeatable, durable and scalable across Intuit' },
    { id: 'esv-d-2', text: 'Identifies and champions continuous improvement opportunities to senior leaders. Creates an environment for teams to test with rapid experimentation, share learnings and drive improvement at scale. Amplifies impact by challenging status quo, scaling through others and reinforcing stakeholder accountability' },
    { id: 'esv-d-3', text: 'Recognized as a role model and works to mature the craft across Intuit. Coaches leaders to create an environment where Program Managers and Business Operations can do the best work of their lives, and influences leaders how to best leverage Program Managers and Business Operations to drive business value' }
  ],
  'VP': [
    { id: 'esv-v-1', text: 'Builds the culture to capture and scale proven frameworks, best practices, tools and templates that are repeatable, durable and scalable across Intuit' },
    { id: 'esv-v-2', text: 'Champions continuous improvement opportunities and adopts new ways of working that drive substantial impact across the organization and/or Intuit. Responsible for introducing reinventions to existing processes or capabilities with transformative impact on results' },
    { id: 'esv-v-3', text: 'Recognized as a thought leader and role model for highly effective Program Management and Business Operations across all levels, especially executive leadership audiences across Intuit. Leads the evolution of the craft across Intuit' }
  ]
};

const LEAD_CHANGE: Record<Level, RubricExpectation[]> = {
  'Manager': [
    { id: 'lc-m-1', text: 'Establishes trusted relationships with the team in order to lead change with velocity' },
    { id: 'lc-m-2', text: 'Understands impact of key changes and actively supports execution of the change management plan' },
    { id: 'lc-m-3', text: 'Exhibits extreme ownership to drive change actions. Engages with identified stakeholders and is attentive to their needs, expectations and responses. Able to communicate a clear case for change to drive actions' }
  ],
  'Senior': [
    { id: 'lc-s-1', text: 'Establishes credibility and strengthens trust across teams, in order to lead change with velocity' },
    { id: 'lc-s-2', text: 'Understands impacts of key changes, helps develop a clear change management plan and actively supports execution of the plan' },
    { id: 'lc-s-3', text: 'Exhibits extreme ownership to drive change effort. Engages with identified stakeholders and is attentive to their needs, expectations and responses. Able to communicate a clear case for change, in order to influence stakeholders to take actions' }
  ],
  'Staff': [
    { id: 'lc-st-1', text: 'Establishes credibility as a boundaryless change leader, strengthens trust across teams, acts as a role model and generates broad support, in order to lead change with velocity' },
    { id: 'lc-st-2', text: 'Partners across teams to identifies impacts of all key changes, develops a clear change management plan and drives end-to-end execution on the plan' },
    { id: 'lc-st-3', text: 'Exhibits extreme ownership to drive change effort. Proactively identifies and engages with stakeholders and anticipates their needs, expectations and responses. Able to communicate a compelling and data-backed case of change, in order to influence stakeholders to take actions. Instills confidence in teams and stakeholders' }
  ],
  'Sr. Staff': [
    { id: 'lc-ss-1', text: 'Establishes credibility as a boundaryless change leader, strengthens trust across teams, builds network of key partnerships and generates broad support, in order to lead change with velocity' },
    { id: 'lc-ss-2', text: 'Leads team to formulate effective change strategy, develop a clear change management plan, identify impacts of all key changes and drive end-to-end execution on the plan' },
    { id: 'lc-ss-3', text: 'Exhibits extreme ownership for complex change effort. Proactively manages stakeholder relationships during change. Leads team to articulate a compelling and data-backed case for change, in order to influence others to take actions. Instills confidence in teams and stakeholders' }
  ],
  'Principal': [
    { id: 'lc-p-1', text: 'Known as a credible, influential and boundaryless change leader, strengthens trust across teams, enhances network of key partnership and generates broad support with well-established and trusted network, in order to lead change with velocity' },
    { id: 'lc-p-2', text: 'Leads team to formulate effective change strategy for large-scale and complex change effort, develop a clear change management plan, identify impacts of all key changes and drive end-to-end execution on the plan' },
    { id: 'lc-p-3', text: 'Exhibits extreme ownership for large-scale, complex change effort. Initiates conversation with senior leaders to get alignment, supported with a compelling and data-backed case for change. Proactively manages relationships with stakeholders at all levels during change and influences them to take actions. Inspires and instills confidence in the team' }
  ],
  'Director': [
    { id: 'lc-d-1', text: 'Known as a credible, influential and boundaryless change leader in a large segment/function, capable of driving transformational changes. Generates broad executive level support with well-established and trusted network, in order to lead change with velocity' },
    { id: 'lc-d-2', text: 'Sets change management vision and path for large-scale and complex change effort. Has a deep understanding on impacts of all key changes and guides multiple teams in parallel to design and execute on the plan' },
    { id: 'lc-d-3', text: 'Exhibits extreme ownership for large-scale, complex change effort. Leads conversation with senior leaders to get alignment and commitment, supported with a compelling and data-backed case for change. Proactively manages relationships with stakeholders at all levels during change, and champions the change throughout the organizations. Inspires and instills confidence in teams, stakeholders and senior leaders' }
  ],
  'VP': [
    { id: 'lc-v-1', text: 'Generates executive level support across the company with a well-established and trusted network, and in-depth understanding of organizational dynamics, in order to drive directional changes with breakthrough velocity' },
    { id: 'lc-v-2', text: 'Sets change management vision and path for strategic, long-term change effort. Is adept at understanding impact of complex changes and guides the organization to execute on the change by leveraging their leadership team, all in service to top-notch customer and stakeholder experience' },
    { id: 'lc-v-3', text: 'Exhibits extreme ownership for multiple large-scale, complex change efforts. Gets alignment and commitment from senior leaders including CEO Staff with a compelling and data-backed case for change. Inspires and instills confidence in direction among teams, stakeholders, and senior leaders' }
  ]
};

// Job-family specific craft skills
const TECHNICAL_DOMAIN_EXPERTISE: Record<Level, RubricExpectation[]> = {
  'Manager': [
    { id: 'tde-m-1', text: 'Quickly learns in new program spaces, collaborates with stakeholders to identify workstreams and mobilize program delivery' },
    { id: 'tde-m-2', text: 'Has a firm grasp of SDLC methodologies. Understands technology solutions clearly within projects and resolves technological risks and issues independently' },
    { id: 'tde-m-3', text: 'Effectively drives communication with technical experts to deliver on the program\'s technical and operational strategy' }
  ],
  'Senior': [
    { id: 'tde-s-1', text: 'Rapidly absorbs and processes important information about new program areas and applies critical thinking to problem-solving. Brings stakeholders together to identify workstreams and drive program delivery across teams' },
    { id: 'tde-s-2', text: 'Has a firm grasp of SDLC methodologies. Understands and incorporates Intuit\'s Tech Strategy, Priorities and Build Culture concepts in managing projects and programs, ensuring actions and decisions align with company\'s technological vision and impact' },
    { id: 'tde-s-3', text: 'Acquires a thorough understanding of technical solutions and effectively communicates with technical experts to resolve risks, issues, and tradeoff discussions. Leads dependent teams to drive engineering and operational excellence' }
  ],
  'Staff': [
    { id: 'tde-st-1', text: 'Capable of swiftly navigating new program areas, deeply diving into subject matter and re-emerging to form an end-to-end blueprint for the program. Leverages AI capabilities to accelerate outcomes' },
    { id: 'tde-st-2', text: 'Possesses extensive knowledge of software development approaches, architecture, and lifecycle. Effectively applies SDLC methodologies and build culture concepts for end-to-end technical program delivery' },
    { id: 'tde-st-3', text: 'Has a detailed understanding of the Intuit Tech Strategy and City Map capabilities, aligning work to the strategy and articulating key technical outcomes. Works closely with dependent teams to promote engineering and operational excellence, and partners with tech leaders to monitor and improve development velocity' }
  ],
  'Sr. Staff': [
    { id: 'tde-ss-1', text: 'Effortlessly navigates various program areas, leveraging experience and AI capabilities to accelerate outcomes, predict challenges, and prevent failures. Identifies and harnesses the expertise of others to reach innovative solutions' },
    { id: 'tde-ss-2', text: 'Possesses deep expertise in software development approach, architecture, and lifecycle. Applies appropriate SDLC methodologies and systems thinking to deliver complex technical programs end-to-end' },
    { id: 'tde-ss-3', text: 'Enables the operationalization of Intuit\'s Tech Strategy and Priorities through builder culture concept. Works with teams to boost engineering and operational excellence and accelerates platform leverage across the tech ecosystem. Increases development velocity at scale across teams' }
  ],
  'Principal': [
    { id: 'tde-p-1', text: 'Skillfully navigates all program/portfolio areas, leveraging deep domain experience to accelerate outcomes, predict challenges and prevent failures. Designs AI capabilities that can be leveraged across multiple programs. Identifies and harnesses the expertise of others to reach innovative solutions' },
    { id: 'tde-p-2', text: 'Possesses deep expertise in software development, architecture, and lifecycle, applying appropriate SDLC methodologies and systems thinking to deliver complex technical programs or portfolios end-to-end. Recognized by technical stakeholders as a strong thought partner, providing useful technical input and insights that drive strategic decisions' },
    { id: 'tde-p-3', text: 'Enables operationalization of Intuit\'s Tech Strategy and Priorities through Builder Culture concepts. Works closely with teams to boost engineering and operational excellence. Influences and accelerates platform leverage across the tech ecosystem, increasing development velocity at scale across Intuit' }
  ],
  'Director': [
    { id: 'tde-d-1', text: 'Can skillfully adapt to any situation or program area, quickly adding value and providing key insights. Reliably identifies the right experts to test assumptions in the end-to-end plan' },
    { id: 'tde-d-2', text: 'Exhibits a deep understanding of software development, architecture, and lifecycle, applying appropriate SDLC methodologies and systems thinking to efficiently deliver complex technical portfolios at scale' },
    { id: 'tde-d-3', text: 'Recognized by senior technical leaders as a strong thought partner. Profound understanding of the overall solution from a technological perspective for any complex program or portfolio, managing technology risks, issues, and dependencies while providing cross-domain insights' }
  ],
  'VP': [
    { id: 'tde-v-1', text: 'Lays out vision for the program approach to achieving strategy and plans through deep understanding of software development, architecture, and lifecycle with the most senior tech executives. Drives accountability of business outcomes through delivery of tech programs' },
    { id: 'tde-v-2', text: 'With knowledge of Intuit Tech Strategy and City Map capabilities and longer term view of what\'s needed to deliver them, influences other Intuit Executives internally to accept program views/practices and agrees/accepts new concepts and approaches, influences Intuit strategy and priorities, and contributes to fiscal year plan' },
    { id: 'tde-v-3', text: 'Identifies numerous elements and patterns when faced with a technical problem, and breaks down those elements to show causal relationship and provide novel and unique program solutions through connections across the company and industry' }
  ]
};

const DOMAIN_EXPERTISE: Record<Level, RubricExpectation[]> = {
  'Manager': [
    { id: 'de-m-1', text: 'Learns fast: demonstrates curiosity and asks the right questions to come up to speed quickly in a new program' },
    { id: 'de-m-2', text: 'Demonstrates valuable knowledge in domain to mobilize teams. Strengthens expertise by diving into key areas and/or going broad to drive operational excellence' },
    { id: 'de-m-3', text: 'Partners with stakeholders to identify workstreams and mobilize program delivery' }
  ],
  'Senior': [
    { id: 'de-s-1', text: 'Quickly absorbs and processes information in new program areas, parsing what is important and relevant, and applies that into problem solving' },
    { id: 'de-s-2', text: 'Demonstrates valuable knowledge in domain to mobilize teams and navigate issues/risks. Strengthens expertise by diving into key areas and/or going broad to drive operational excellence' },
    { id: 'de-s-3', text: 'Independently identifies workstreams and owners to mobilize program delivery' }
  ],
  'Staff': [
    { id: 'de-st-1', text: 'Able to rapidly navigate new program areas, diving deep into a subject area and resurfacing to develop an end-to-end blueprint for the program' },
    { id: 'de-st-2', text: 'Possesses extensive domain knowledge to drive domain specific discussions. Strengthens expertise, leveraging outside in knowledge to navigate risks and drive operational excellence' },
    { id: 'de-st-3', text: 'Able to drive domain specific discussions, leading the experts in the field through active problem solving to mobilize teams to deliver on program outcomes' }
  ],
  'Sr. Staff': [
    { id: 'de-ss-1', text: 'Navigates all program areas with ease, drawing from deep domain experience to accelerate outcomes, predict challenges, and prevent failures' },
    { id: 'de-ss-2', text: 'Skillfully connects the dots across other domains. Develops and demonstrates outside in knowledge to shape the best program approach and drive operational excellence' },
    { id: 'de-ss-3', text: 'Quickly identifies the right experts to test assumptions, further building confidence in the end-to-end plan' }
  ],
  'Principal': [
    { id: 'de-p-1', text: 'Can walk into any room or situation and orient themselves, easily navigating almost any program area and quickly adding value' },
    { id: 'de-p-2', text: 'Known for deep cross-domain expertise. Skillfully connects the dots across programs to shape the best program approach and effectively manage portfolio risks. Exhibits continuous learning mindset, working boundarylessly across orgs to quick learn, and build capability in teams to drive operational excellence at scale' },
    { id: 'de-p-3', text: 'Knows the right experts to test assumptions and identify key insights to build confidence in the end-to-end plan' }
  ],
  'Director': [
    { id: 'de-d-1', text: 'Can walk into any room or situation and orient themselves, easily navigating almost any program area and quickly adding value' },
    { id: 'de-d-2', text: 'Known for deep cross-domain expertise. Skillfully connects the dots across programs to shape the best program approach and effectively manage portfolio risks' },
    { id: 'de-d-3', text: 'Knows the right experts to test assumptions and identify key insights to build confidence in the end-to-end plan' }
  ],
  'VP': [
    { id: 'de-v-1', text: 'Deeply understands how the program outcomes deliver customer benefit and Intuit level strategic outcomes. Ensures the teams have this strategic context as they execute' },
    { id: 'de-v-2', text: 'Lays out vision for the program/portfolio approach to achieving strategy and plans through continuous development of deep expertise and understanding of multiple domains critical to the business. Builds cross-domain expertise in leaders to apply the best solution/approach to any complex program or portfolio and drive operational excellence at scale' },
    { id: 'de-v-3', text: 'Maintains strategic alignment with executive leaders in all organizations needed to deliver the desired customer outcomes to accelerate program delivery' }
  ]
};

const SOLVE_BUSINESS_PROBLEMS: Record<Level, RubricExpectation[]> = {
  'Manager': [
    { id: 'sbp-m-1', text: 'Gathers and reviews internal and external information to quickly ramp up in new domains, and applies learnings to problem solving, with guidance' },
    { id: 'sbp-m-2', text: 'Helps frame strategic questions to simplify complex problems. Able to develop hypotheses, conduct error-free analysis and generate insights, with guidance. Develops data-backed recommendations and conveys to others with clearly structured information and easy to follow logic' },
    { id: 'sbp-m-3', text: 'Contributes ideas that helps shape organizational strategy, enhance operating systems, build business processes and improve business efficiency' }
  ],
  'Senior': [
    { id: 'sbp-s-1', text: 'Gathers and reviews internal and external information to quickly ramp up in new domains, and able to apply learnings to problem solving independently' },
    { id: 'sbp-s-2', text: 'Able to frame strategic questions, run experiments, conduct error-free analysis and identify solutions independently. Develops recommendations and conveys to others with well structured arguments' },
    { id: 'sbp-s-3', text: 'Identifies approach to ideate and identify high-impact opportunities that helps shape organizational strategy, enhance operating systems, build business processes and improve business efficiency' }
  ],
  'Staff': [
    { id: 'sbp-st-1', text: 'Gathers and reviews internal and external information to quickly ramp up in new domains, and apply learnings to problem solving. Able to disseminate learnings effectively, in order to accelerate learnings for others' },
    { id: 'sbp-st-2', text: 'Leads the end-to-end problem solving process, from defining problems, framing strategic questions, prioritizing works, running experiments to ideating solutions. Develops recommendations and conveys to stakeholders at all levels with thoughtful arguments that are tailored to the audience' },
    { id: 'sbp-st-3', text: 'Drives and leads the process to ideate and identify high-impact opportunities that helps shape organizational strategy, enhance operating systems, build business processes and improve business efficiency' }
  ],
  'Sr. Staff': [
    { id: 'sbp-ss-1', text: 'Able to quickly ramp up expertise in new domains, easily navigate across different domains, draw learnings from pattern recognition and apply all to problem solving. Able to quickly identify gaps in knowledge, bring in others to fill those gaps and accelerate learnings for others' },
    { id: 'sbp-ss-2', text: 'Sets direction and approach to solve complex problems. Able to challenge assumptions and sees several steps ahead. Develops recommendations and facilitates discussions with senior leaders' },
    { id: 'sbp-ss-3', text: 'Able to quickly identify great ideas and high-impact opportunities that helps shape organizational strategy, enhance operating systems, build business processes and improve business efficiency' }
  ],
  'Principal': [
    { id: 'sbp-p-1', text: 'Can walk into any room or situation and orient themselves, easily navigating across different domains, drawing learnings from pattern recognition and quickly adding value. Able to quickly identify gaps in knowledge, knows how to leverage expertise in others and accelerate learnings for others' },
    { id: 'sbp-p-2', text: 'Sets direction and approach to solve complex problems. Able to challenge assumptions and sees several steps ahead. Develops recommendations and leads discussions with senior leaders. Established reputation as a sought-after thought partner for senior leaders' },
    { id: 'sbp-p-3', text: 'Has sharp business acumen to quickly identify great ideas and champions high-impact opportunities, that help shape organizational strategy, enhance operating systems, build business processes and improve business efficiency' }
  ],
  'Director': [
    { id: 'sbp-d-1', text: 'Can walk into any room or situation and orient themselves, easily navigating across different domains, drawing learnings from pattern recognition and quickly adding value. Able to easily identify capability gaps or performance potential, while leveraging expertise in others and accelerate learnings for others' },
    { id: 'sbp-d-2', text: 'Sets direction and approach to solve complex problems. Able to challenge assumptions and sees several steps ahead. Develops recommendations and leads discussions with senior leaders. Established reputation as a sought-after thought partner for senior leaders' },
    { id: 'sbp-d-3', text: 'Has sharp business acumen to quickly identify great ideas and champions high-impact opportunities, that help shape organizational strategy, enhance operating systems, build business processes and improve business efficiency' }
  ],
  'VP': [
    { id: 'sbp-v-1', text: 'Orients themselves to any situation or scenario irrespective of domain, and quickly adds value to change the outcome if so warranted. Able to easily identify capability gaps or performance potential, while leveraging expertise in others and accelerate learnings for others' },
    { id: 'sbp-v-2', text: 'Leads organizations and teams to develop and implement creative solutions to pressing business problems at any level including Intuit-wide' },
    { id: 'sbp-v-3', text: 'Leverages deep business acumen across the company to challenge status quo where needed and to inspire bold ideas and thinking in others' }
  ]
};

// Main function to get expectations based on job family, craft skill, and level
export function getRubricExpectations(
  jobFamily: string,
  craftSkill: string,
  level: Level
): RubricExpectation[] {
  // Shared craft skills - same for all job families
  if (craftSkill === 'Connect Strategy to Execution') {
    return CONNECT_STRATEGY_TO_EXECUTION[level] || [];
  }
  if (craftSkill === 'Execute with Rigor') {
    return EXECUTE_WITH_RIGOR[level] || [];
  }
  if (craftSkill === 'Enable Scale and Velocity') {
    return ENABLE_SCALE_AND_VELOCITY[level] || [];
  }
  if (craftSkill === 'Lead Change') {
    return LEAD_CHANGE[level] || [];
  }

  // Job-family specific craft skills
  if (craftSkill === 'Technical Domain Expertise' && jobFamily === 'TPM') {
    return TECHNICAL_DOMAIN_EXPERTISE[level] || [];
  }
  if (craftSkill === 'Domain Expertise' && (jobFamily === 'PgM' || jobFamily === 'PjM')) {
    return DOMAIN_EXPERTISE[level] || [];
  }
  if (craftSkill === 'Solve Business Problems' && jobFamily === 'BizOps') {
    return SOLVE_BUSINESS_PROBLEMS[level] || [];
  }

  return [];
}
