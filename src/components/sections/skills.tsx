import React from 'react'
import SKILLS from '@/data/skills'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Skills() {
  return (
    <div className="mb-16">
      <h2 className="mb-8 text-xl font-heading sm:text-2xl">Skills</h2>
      <div className="bg-white/80 dark:bg-[#18191a] border-l-4 border-[var(--color-main)] rounded-[var(--radius-base)] shadow-[var(--shadow-shadow)] p-6 w-fit mx-auto transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative min-w-[900px]">
          {/* Vertical line */}
          <div className="absolute left-[260px] top-0 h-full w-px bg-black dark:bg-white z-0" />
          {/* Horizontal line - now extends all the way to the left */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-black dark:bg-white z-0" style={{transform: 'translateY(-1px)'}} />
          <div className="grid grid-rows-2 grid-cols-2 gap-x-6 relative z-10 min-h-[180px]">
            {/* Frontend row */}
            <div className="flex items-center pl-2 min-h-[80px]">
              <span className="font-heading text-2xl sm:text-3xl whitespace-nowrap text-left">{SKILLS[0].field}</span>
            </div>
            <div className="flex items-center pl-2 min-h-[80px] justify-start">
              <div className="flex flex-nowrap gap-5 items-center justify-start">
                {SKILLS[0].skills.map((skill, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <skill.icon className="h-9 w-9" title="" />
                      </TooltipTrigger>
                      <TooltipContent>{skill.skill}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            {/* Backend row */}
            <div className="flex items-center pl-2 min-h-[80px]">
              <span className="font-heading text-2xl sm:text-3xl whitespace-nowrap text-left">{SKILLS[1].field}</span>
            </div>
            <div className="flex items-center pl-2 min-h-[80px] justify-start">
              <div className="flex flex-nowrap gap-5 items-center justify-start">
                {SKILLS[1].skills.map((skill, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <skill.icon className="h-9 w-9" title="" />
                      </TooltipTrigger>
                      <TooltipContent>{skill.skill}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
