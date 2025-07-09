import PAST_ROLES from '@/data/experience'

export default function Experience() {
  return (
    <div className="mb-16">
      <h2 className="mb-8 text-xl font-heading sm:text-2xl">Experience</h2>

      {PAST_ROLES.map((role, id) => {
        return (
          <div
            className="mb-8 bg-white/80 dark:bg-[#18191a] border-l-4 border-[var(--color-main)] rounded-[var(--radius-base)] shadow-[var(--shadow-shadow)] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            key={id}
          >
            <h3 className="text-lg font-heading sm:text-xl">
              {role.role} @ {role.company}
            </h3>

            <p className="mb-4 mt-0.5 text-sm">
              {role.startDate} - {role.endDate}
            </p>
            <p>{role.description}</p>
          </div>
        )
      })}
    </div>
  )
}
