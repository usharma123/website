import { BRAND_ICONS } from '@/data/brand-icons'
import SKILLS, { type Skill } from '@/data/skills'

/** Skill tiles: the brand mark in ink, which takes on the brand's own color
 *  on hover. Skills without a mark get a typeset monogram instead. */
export default function SkillGrid() {
  return (
    <div className="space-y-6">
      {SKILLS.map((group) => (
        <section key={group.field}>
          <h3 className="text-muted mb-2 font-mono text-[12px]">
            {group.field.toLowerCase()}
          </h3>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
            {group.skills.map((s) => (
              <SkillTile key={s.name} skill={s} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function SkillTile({ skill }: { skill: Skill }) {
  const brand = skill.icon ? BRAND_ICONS[skill.icon] : null
  return (
    <li
      className="group border-rule bg-paper hover:border-ink flex flex-col items-center gap-2 rounded-md border-[1.5px] px-2 pt-3.5 pb-2.5 text-center transition-colors"
      style={brand ? { ['--brand' as string]: brand.hex } : undefined}
    >
      {brand ? (
        <svg
          viewBox="0 0 24 24"
          width={28}
          height={28}
          aria-hidden
          className="fill-ink transition-colors group-hover:fill-[var(--brand)]"
        >
          <path d={brand.path} />
        </svg>
      ) : (
        <span
          aria-hidden
          className="border-ink bg-chrome group-hover:bg-marker grid size-7 place-items-center rounded-md border-[1.5px] font-mono text-[10.5px] font-semibold transition-colors"
        >
          {monogram(skill.name)}
        </span>
      )}
      <span className="text-[12.5px] leading-tight font-medium">
        {skill.name}
      </span>
    </li>
  )
}

/** "Diffusion models" → "Dm", "XGBoost" → "XG", "RAG" → "RAG" */
function monogram(name: string) {
  if (name.length <= 3) return name
  const words = name.split(/\s+/)
  return words.length > 1
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : name.slice(0, 2)
}
