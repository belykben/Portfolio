import { FlowingMenu, type MenuItemData } from '../../components/FlowingMenu/FlowingMenu';
import MagneticButton from '../../components/MagneticButton/MagneticButton';
import styles from './Projects.module.css';

const PROJECTS_DATA: MenuItemData[] = [
  {
    link: '#projects',
    text: 'Intellivo - Local AI OCR',
    category: 'Textile & Document AI',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  },
  {
    link: '#projects',
    text: 'SDLC Codebase Modernization',
    category: 'Banking & Agentic AI',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    link: '#projects',
    text: 'SEC 8-K GraphRAG Platform',
    category: 'FinTech & Knowledge Graph',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1000&auto=format&fit=crop',
  },
  {
    link: '#projects',
    text: 'Clarium Edge Design System',
    category: 'Frontend & Enterprise UI',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
  },
  {
    link: '#projects',
    text: 'Benefitmall Security Platform',
    category: 'Insurance & Security',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    link: '#projects',
    text: 'SOW Analytics Tracker',
    category: 'Data Pipelines & Analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function Projects() {
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
          />
        </div>

        <div className={styles.footerAction}>
          <MagneticButton
            variant="fill"
            size="md"
            onClick={() => window.open('https://github.com/belykben', '_blank')}
          >
            More Works
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
