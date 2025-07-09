import Experience from '@/components/sections/experience'
import Skills from '@/components/sections/skills'

export default function About() {
  return (
    <div className="font-base mt-16">
      <h1 className="mb-8 text-2xl font-heading sm:text-4xl">About</h1>
      <div className="bg-white/80 dark:bg-[#18191a] border-l-4 border-[var(--color-main)] rounded-[var(--radius-base)] shadow-[var(--shadow-shadow)] p-8 mb-10 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="text-base sm:text-lg">
          <p>
            I&apos;m a builder at the intersection of AI, healthcare, and law, passionate about turning complex, manual workflows into smart systems. 
            I co-founded Patent-It AI to streamline patent and legal diligence, cutting hours of work to minutes. 
            With a background in biomedical engineering, AI, and clinical research, I&apos;ve led teams across projects from GAN-based medical imaging to agentic RAG tools for litigation. I thrive in research-driven, user-focused environments and am currently scaling tools that support decision-making in regulated spaces.
          </p>
        </div>
      </div>

      <Skills />

      <Experience />
    </div>
  )
}
