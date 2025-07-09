import Experience from '@/components/sections/experience'
import Skills from '@/components/sections/skills'

export default function About() {
  return (
    <div className="font-base">
      <h1 className="mb-8 text-2xl font-heading sm:text-4xl">About</h1>

      <div className="mb-10 text-base sm:text-lg">
        <p>
        I'm a builder at the intersection of AI, healthcare, and law, passionate about turning complex, manual workflows into smart systems. 
        I co-founded Patent-It AI to streamline patent and legal diligence, cutting hours of work to minutes. 
        With a background in biomedical engineering, AI, and clinical research, I’ve led teams across projects from GAN-based medical imaging to agentic RAG tools for litigation. I thrive in research-driven, user-focused environments and am currently scaling tools that support decision-making in regulated spaces.
        </p>
      </div>

      <Skills />

      <Experience />
    </div>
  )
}
