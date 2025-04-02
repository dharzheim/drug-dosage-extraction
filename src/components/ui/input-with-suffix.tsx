import * as React from 'react'
import { Input } from '@/components/ui/input'

function InputWithSuffix({ suffix, ...props }: React.ComponentProps<'input'> & { suffix: string }) {
  return (
    <div
      className="flex items-center w-full border border-interactive
          rounded-lg
          overflow-hidden
          focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]"
    >
      <Input
        className="
            block w-full
            flex-grow
            min-w-0
            border-none
            focus-visible:ring-0
            focus-visible:outline-none"
        {...props}
      />
      <span
        className="inline-flex items-center
            px-4 py-2
            bg-interactive"
      >
        {suffix}
      </span>
    </div>
  )
}

export { InputWithSuffix }
