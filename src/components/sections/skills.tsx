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

      {/* CARD */}
      <div className="bg-white/80 dark:bg-[#18191a]
                      border-l-4 border-[var(--color-main)]
                      rounded-[var(--radius-base)]
                      shadow-[var(--shadow-shadow)]
                      p-6
                      w-full md:max-w-[48rem]     /* ⟵ same width as other cards */
                      transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative">
          {/* vertical divider */}
          <div className="absolute inset-y-0
                          left-[calc(7rem+0.75rem)] /* 7-rem label + half gap */
                          w-px bg-black dark:bg-white" />

          {/* FRONTEND */}
          <div className="flex items-center gap-x-6 pb-4 mb-4 border-b border-black dark:border-white">
            <div className="w-28 flex-shrink-0">
              <h3 className="font-heading text-lg sm:text-xl whitespace-nowrap">
                {SKILLS[0].field}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {SKILLS[0].skills.map((skill, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <skill.icon className="h-8 w-8 sm:h-9 sm:w-9" />
                    </TooltipTrigger>
                    <TooltipContent>{skill.skill}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* BACKEND */}
          <div className="flex items-center gap-x-6">
            <div className="w-28 flex-shrink-0">
              <h3 className="font-heading text-lg sm:text-xl whitespace-nowrap">
                {SKILLS[1].field}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {SKILLS[1].skills.map((skill, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <skill.icon className="h-8 w-8 sm:h-9 sm:w-9" />
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
  )
}

