import Links from '@/components/links'

export default function Home() {
  return (
    <div className="flex items-start gap-8 font-base mt-12">
      <img
        src="/avatar.png"
        alt="Utsav Sharma Avatar"
        className="w-56 h-56 object-cover rounded-[var(--radius-base)] border-2 border-[var(--color-border)] shadow-[var(--shadow-shadow)] bg-[var(--color-secondary-background)]"
      />
      <div>
        <h1 className="text-2xl font-heading sm:text-4xl">Utsav Sharma</h1>
        <p className="mt-2 text-lg sm:text-xl">Avid Learner</p>
        <div className="mt-8 text-base sm:text-lg">
          <p>Hi, I am an incoming Master&apos;s student at UPenn&apos;s School of Engineering and Applied Science studying Computer Science.</p>

          <br />

          <p>
            This is the neobrutalism portfolio template. Check the{' '}
            <a
              target="_blank"
              className="font-heading underline"
              href="https://github.com/neobrutalism-templates/portfolio"
            >
              github repo
            </a>{' '}
            for more info.
          </p>
        </div>

        <Links />
      </div>
    </div>
  )
}
