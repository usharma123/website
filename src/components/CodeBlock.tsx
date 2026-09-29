import type { ComponentProps } from 'react'

import CopyCodeButton from './CopyCodeButton'

export default function CodeBlock(props: ComponentProps<'pre'>) {
  return (
    <div className="group relative">
      <CopyCodeButton />
      <pre {...props} />
    </div>
  )
}
