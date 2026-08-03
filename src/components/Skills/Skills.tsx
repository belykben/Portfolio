import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Skills.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export type SkillGroup = {
  title: string
  items: string[]
}

export interface SkillsProps {
  subtitle?: string
  title?: React.ReactNode
  skillGroups?: SkillGroup[]
  className?: string
  id?: string
}

export const defaultSkillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    items: [
      'Python',
      'FastAPI',
      'REST APIs',
      'PostgreSQL',
      'SQLAlchemy',
      'Pydantic',
      'JWT/Auth',
      'Microservices',
      'Redis',
      'MongoDB',
    ],
  },
  {
    title: 'Frontend',
    items: [
      'React.js',
      'TypeScript',
      'JavaScript',
      'Angular',
      'HTML',
      'CSS/SCSS',
      'Tailwind CSS',
      'Material UI',
      'Storybook',
    ],
  },
  {
    title: 'AI / LLM',
    items: [
      'LangChain',
      'LangGraph',
      'RAG',
      'GraphRAG',
      'vLLM',
      'Qwen',
      'Pixtral',
      'Gemini API',
      'Document AI',
      'OCR',
    ],
  },
  {
    title: 'Data / Processing',
    items: [
      'Pandas',
      'NumPy',
      'PySpark',
      'CSV Processing',
      'Data Pipelines',
      'Parallel Processing',
      'Structured JSON Extraction',
    ],
  },
  {
    title: 'DevOps & Tools',
    items: [
      'Docker',
      'Docker Compose',
      'Kubernetes',
      'Kafka',
      'Git',
      'GitHub',
      'GitLab',
      'Linux',
      'Nginx',
      'Postman',
    ],
  },
  {
    title: 'Engineering Workflow',
    items: [
      'Swagger/OpenAPI',
      'Jira',
      'Confluence',
      'Azure DevOps',
      'Bitbucket',
      'npm',
      'Prometheus',
      'Grafana',
    ],
  },
]

export function Skills({
  subtitle = '',
  title = '',
  skillGroups = defaultSkillGroups,
  className = '',
  id = 'skills',
}: SkillsProps) {
  const [openSkill, setOpenSkill] = useState<number | null>(0)
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-panel', {
        y: 72,
        autoAlpha: 0,
        duration: 0.86,
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleToggle = (index: number) => {
    setOpenSkill((prev) => (prev === index ? null : index))
  }

  return (
    <section
      ref={sectionRef}
      className={`skills ${className}`.trim()}
      id={id}
      data-timeline="Skills"
    >
      <div className="skills-panel skills-left">
        {subtitle && <span className="skills-subtitle">{subtitle}</span>}
        {title && <h2>{title}</h2>}
      </div>

      <div className="skills-panel skills-list">
        {skillGroups.map((group, index) => {
          const isOpen = openSkill === index
          return (
            <div
              className={`skill-group ${isOpen ? 'open' : ''}`}
              key={group.title}
            >
              <button type="button" onClick={() => handleToggle(index)}>
                <span>{group.title}</span>
                <span className="skill-toggle">{isOpen ? '-' : '+'}</span>
              </button>
              <div className="skill-body">
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Skills
