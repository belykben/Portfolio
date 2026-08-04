import { useState } from 'react';
import { FlowingMenu, type MenuItemData } from '../../components/FlowingMenu';
import MagneticButton from '../../components/MagneticButton';
import WarpModal from '../../components/WarpModal';
import styles from './Projects.module.css';

const PROJECTS_DATA: MenuItemData[] = [
  {
    link: 'https://github.com/belykben',
    githubUrl: 'https://github.com/belykben',
    text: 'Intellivo - Local AI OCR',
    category: 'Textile & Document AI',
    role: 'Lead AI & Full Stack Engineer',
    period: '2023 - Present',
    domain: 'Textile Domain | Local AI & Document Intelligence',
    description: 'High-speed local OCR and document processing engine leveraging lightweight quantized models for zero-cloud data privacy in manufacturing and textile ERPs.',
    longDescription: 'Built an enterprise-grade local AI-powered invoice OCR platform processing multi-format PDF/scanned/handwritten invoices from 1 to 200+ pages. Replaced cloud-dependent Gemini API extractions with secure local VLM inference running on custom RTX 4090 workstation hardware, eliminating recurring cloud API fees while maintaining zero-cloud data privacy.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    metrics: [
      { label: 'Extraction Accuracy', value: '95%+', subtext: 'On complex 200+ page invoices' },
      { label: 'Processing Speedup', value: '30m → 8m', subtext: '73% decrease in turnaround' },
      { label: 'Cloud API Cost', value: '$0 / Mo', subtext: '100% local vLLM inference' },
      { label: 'Max Ingestion', value: '200+ Pages', subtext: 'Kafka page-parallel processing' },
    ],
    highlights: [
      'Replaced cloud API extractions with local VLM inference using Qwen3-VL-8B-Instruct-FP8 & Pixtral-12B on RTX 4090 workstation node via vLLM.',
      'Implemented page-level parallel processing and Kafka-based asynchronous pipelines for massive document throughput.',
      'Designed FastAPI microservices and relational PostgreSQL schemas handling upload pipelines, extraction fields, and editable invoice validation.',
      'Built interactive React review portal featuring live tabular correction workflows, data visualization, and automated business-rule outputs.',
      'Received Clarium Tech Rising Star Award (2024 & 2026) and direct client appreciation for delivery quality and cost optimization.',
    ],
    techStack: ['Python', 'FastAPI', 'React.js', 'PostgreSQL', 'Kafka', 'LangChain', 'LangGraph', 'vLLM', 'Qwen3-VL-8B', 'Pixtral-12B', 'Docker', 'RTX 4090'],
  },
  {
    link: 'https://github.com/belykben',
    githubUrl: 'https://github.com/belykben',
    text: 'SDLC Codebase Modernization',
    category: 'Banking & Agentic AI',
    role: 'AI Systems Architect & Full Stack',
    period: '2024 - Present',
    domain: 'Banking Domain | Agentic AI & Modernization',
    description: 'Autonomous AI refactoring pipeline converting legacy banking monoliths into modular microservices with automated AST verification and zero regression.',
    longDescription: 'Engineered an AI-assisted SDLC reverse-engineering platform designed to analyze legacy banking codebases and forward-engineer them into modern enterprise microservices architecture standards. Orchestrated specialized AI agent swarms to extract system domain knowledge and produce technical artifacts.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    metrics: [
      { label: 'Agent Collaboration', value: '4 Swarms', subtext: 'Business, Data, App & Tech' },
      { label: 'Refactoring Speed', value: '10x Faster', subtext: 'Automated reverse engineering' },
      { label: 'Verification', value: 'Zero-Regression', subtext: 'AST mapping & dependency graph' },
    ],
    highlights: [
      'Designed specialized LangGraph agents for business, data, application, and technology architecture layers to analyze legacy banking monoliths.',
      'Extracted hidden business logic, producing automated AST dependency maps, module views, and architecture summaries.',
      'Generated enterprise-ready modernization outputs including microservice blueprints, database schemas, and technical docs.',
      'Developed React and FastAPI portals for uploading codebase analysis outputs, auditing generated artifacts, and tracking project data.',
    ],
    techStack: ['Python', 'React.js', 'PostgreSQL', 'FastAPI', 'GenAI', 'Agentic AI', 'Qwen-3.6-35B', 'LangChain', 'LangGraph', 'AST Engineering'],
  },
  {
    link: 'https://github.com/belykben',
    githubUrl: 'https://github.com/belykben',
    text: 'SEC 8-K GraphRAG Platform',
    category: 'FinTech & Knowledge Graph',
    role: 'Full Stack & RAG Architect',
    period: '2024',
    domain: 'FinTech & Corporate Regulatory Intelligence',
    description: 'Real-time financial intelligence platform constructing knowledge graphs from SEC filings for instant supply-chain risk extraction and semantic search.',
    longDescription: 'Architected a FastAPI and React-based RAG platform over SEC 8-K filings. Integrated direct SEC EDGAR document retrieval with Neo4j GraphRAG knowledge graphs, enabling complex cross-filing contextual Q&A, relationship mapping, and supply-chain risk analysis.',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1000&auto=format&fit=crop',
    metrics: [
      { label: 'Graph Index', value: 'Neo4j Graph', subtext: 'Multi-entity relationship mapping' },
      { label: 'Vector Engine', value: 'Qdrant / RAG', subtext: 'Dense semantic chunk retrieval' },
      { label: 'Ingestion Source', value: 'SEC EDGAR', subtext: 'Automated 8-K filing pipeline' },
    ],
    highlights: [
      'Built automated SEC EDGAR filing fetcher, document chunking, vector embedding, and Qdrant storage pipeline.',
      'Implemented GraphRAG workflows combining dense vector retrieval with Neo4j entity graph traversal for zero-context-loss financial Q&A.',
      'Created intuitive React interface enabling filing selection, natural language querying, and interactive relationship visualizers.',
    ],
    techStack: ['FastAPI', 'React.js', 'Python', 'Neo4j', 'GraphRAG', 'Vector DB', 'Qdrant', 'RAG', 'LangChain', 'SEC EDGAR API'],
  },
  {
    link: 'https://github.com/belykben',
    githubUrl: 'https://github.com/belykben',
    text: 'Clarium Edge Design System',
    category: 'Frontend & Enterprise UI',
    role: 'Lead UI Platform Engineer',
    period: '2023 - Present',
    domain: 'Enterprise Product Infrastructure',
    description: 'Enterprise React & WebGL component suite delivering fluid 60fps micro-animations, themeable glassmorphism, and strict accessibility standards.',
    longDescription: 'Developed and maintained a production-grade UI component platform for enterprise client products. Standardized component architecture across Angular and React stacks with 100+ accessible components, automated npm releases, and comprehensive Storybook documentation.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
    metrics: [
      { label: 'UI Suite', value: '100+ Components', subtext: 'Buttons, Forms, Modals, Tables' },
      { label: 'Framework Support', value: 'React & Angular', subtext: 'Unified design tokens & styling' },
      { label: 'Delivery Model', value: 'npm & Storybook', subtext: 'Published reusable packages' },
    ],
    highlights: [
      'Engineered 100+ production-grade reusable UI components across Angular and React ecosystems.',
      'Built advanced component modules including dynamic schema-driven form builders, virtualized tables, modals, and dropdowns.',
      'Published modular packages through npm and authored comprehensive Storybook documentation for rapid engineering onboarding.',
    ],
    techStack: ['Angular', 'React.js', 'TypeScript', 'npm', 'Storybook', 'Material UI', 'Tailwind CSS', 'SCSS Modules'],
  },
  {
    link: 'https://github.com/belykben',
    githubUrl: 'https://github.com/belykben',
    text: 'Benefitmall Security Platform',
    category: 'Insurance & Security',
    role: 'Full Stack & Security Specialist',
    period: '2023',
    domain: 'Insurance Domain | Veracode Security & IAM',
    description: 'Zero-Trust IAM portal managing HIPAA-compliant identity federation, biometric step-up auth, and high-throughput real-time security auditing.',
    longDescription: 'Executed full-stack legacy modernization for an enterprise insurance application by eliminating critical Veracode security vulnerabilities. Refactored SQL queries, hardened authentication barriers, and ensured strict HIPAA-compliant data security across the portal.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    metrics: [
      { label: 'Security Audit', value: '0 Vulnerabilities', subtext: 'Veracode scan certification' },
      { label: 'Protection', value: 'HIPAA Compliant', subtext: 'Zero-Trust data isolation' },
      { label: 'Code Quality', value: 'Enterprise A+', subtext: 'Refactored backend architecture' },
    ],
    highlights: [
      'Remediated severe Veracode security findings including SQL injection, CSRF, and authorization flaws across legacy services.',
      'Optimized PostgreSQL queries, backend routing in Python, and user permission models for high-throughput insurance operations.',
      'Enhanced React frontend components for secure session management and role-based access control.',
    ],
    techStack: ['Python', 'React.js', 'PostgreSQL', 'Veracode', 'REST APIs', 'SQL Security', 'JWT Auth'],
  },
  {
    link: 'https://github.com/belykben',
    githubUrl: 'https://github.com/belykben',
    text: 'SOW Analytics Tracker',
    category: 'Data Pipelines & Analytics',
    role: 'Full Stack & Data Engineer',
    period: '2023',
    domain: 'Internal Platform | Executive Analytics',
    description: 'Executive dashboard tracking statement-of-work deliverables, burn rates, and predictive milestone delivery timelines across multi-million dollar engineering contracts.',
    longDescription: 'Built an internal Statement of Work analytics platform from scratch to transform raw CSV inputs into executive insights. Implemented automated SQL calculations, milestone delivery tracking, and Docker-based containerized deployments for internal engineering teams.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    metrics: [
      { label: 'CSV Ingestion', value: 'Automated SQL', subtext: 'Instant relational mapping' },
      { label: 'Deployment', value: 'Docker Compose', subtext: 'Containerized microservice stack' },
      { label: 'Burn Analytics', value: 'Real-Time', subtext: 'Predictive milestone tracking' },
    ],
    highlights: [
      'Engineered automated CSV ingestion engine executing complex SQL aggregation queries for deliverable burn rate tracking.',
      'Developed FastAPI endpoints, relational database schemas, and full-stack React executive dashboards.',
      'Configured Docker Compose environment for single-command deployment across internal engineering workstations.',
    ],
    techStack: ['Python', 'FastAPI', 'React.js', 'PostgreSQL', 'Docker', 'Docker Compose', 'SQL Engine'],
  },
];

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MenuItemData | null>(null);

  const handleItemClick = (item: MenuItemData) => {
    setSelectedProject(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className={styles.section} id="projects" aria-label="Featured Projects">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Featured Works</h2>
        </div>

        <div className={styles.menuContainer}>
          <FlowingMenu
            items={PROJECTS_DATA}
            speed={18}
            textColor="#ffffff"
            bgColor="transparent"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#060010"
            borderColor="rgba(255, 255, 255, 0.14)"
            badgeColor="oklch(0.89 0.029 195)"
            badgeTextColor="#060010"
            onItemClick={handleItemClick}
          />
        </div>

        <div className={styles.footerAction}>
          <MagneticButton
            variant="outline"
            size="md"
            onClick={() => window.open('https://github.com/belykben', '_blank')}
          >
            More Works
          </MagneticButton>
        </div>
      </div>

      <WarpModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
        projects={PROJECTS_DATA}
        onSelectProject={(newProject) => setSelectedProject(newProject)}
      />
    </section>
  );
}
