export type Role = {
  company: string
  role: string
  description: string
  startDate: string
  endDate: string
  location?: string
  tags?: string[]
}

const EXPERIENCE: Role[] = [
  {
    company: 'Xoriant',
    role: 'Software Engineer',
    description:
      'Consulting for CLS Group on application development of their CLSnet platform.',
    startDate: 'November 2025',
    endDate: 'Present',
    location: 'New Jersey',
    tags: ['fintech', 'platform'],
  },
  {
    company: 'Vetra',
    role: 'Co-Founder & COO',
    description:
      'Built prototypes for RAG and scraping architectures to streamline agent-based workflows in patent search and litigation, cutting hours of diligence to minutes.',
    startDate: 'April 2024',
    endDate: 'August 2025',
    location: 'Gainesville, FL',
    tags: ['rag', 'agents', 'legal-tech', 'startup'],
  },
  {
    company: 'Dream Team Engineering',
    role: 'Vice President',
    description:
      'Led a 140-person team driving design and software projects, evaluating their effectiveness within the UF Health Shands Hospital ecosystem.',
    startDate: 'January 2025',
    endDate: 'May 2025',
    location: 'Gainesville, FL',
    tags: ['leadership', 'healthcare'],
  },
  {
    company: 'Dream Team Engineering',
    role: 'Director of Research Development',
    description:
      'Led five research teams, coordinating resources between Shands Hospital and DTE to secure IRB approval for the applications DTE developed.',
    startDate: 'May 2024',
    endDate: 'May 2025',
    location: 'Gainesville, FL',
    tags: ['research', 'irb'],
  },
  {
    company: 'University of Florida',
    role: 'Undergraduate Teaching Assistant',
    description:
      'Taught a biochemistry section of 20 students — lectures, discussion, grading, and one-on-one guidance.',
    startDate: 'August 2024',
    endDate: 'December 2024',
    location: 'Gainesville, FL',
    tags: ['teaching', 'biochemistry'],
  },
  {
    company: 'Florida International University',
    role: 'Research Study Assistant',
    description:
      'Reviewed 8,000+ scientific articles in COVIDENCE under the PRISMA framework for a systematic review on caregiver burden among parents of transition-age youth with autism.',
    startDate: 'May 2021',
    endDate: 'August 2021',
    location: 'Miami, FL',
    tags: ['research', 'systematic-review'],
  },
]

export default EXPERIENCE
