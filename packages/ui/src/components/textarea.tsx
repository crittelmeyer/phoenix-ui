import * as React from 'react'
import { cn } from '../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, onInput, value, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)

    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        // Set internal ref for autoResize functionality
        internalRef.current = node

        // Forward ref to parent
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            node
        }
      },
      [ref],
    )

    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current
      if (!textarea || !autoResize) return

      // Reset height to auto to get correct scrollHeight
      textarea.style.height = 'auto'
      // Set height to scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`
    }, [autoResize])

    React.useLayoutEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const handleInput = React.useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight()
        onInput?.(e)
      },
      [adjustHeight, onInput],
    )

    return (
      <textarea
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          autoResize && 'resize-none overflow-hidden',
          className,
        )}
        ref={setRef}
        onInput={handleInput}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
