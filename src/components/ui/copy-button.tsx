import { Check, Copy, Warning } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

type CopyState = 'idle' | 'done' | 'error'

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
  ariaLabel: string
}

export function CopyButton({
  value,
  label = '复制',
  className = '',
  ariaLabel,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setState('done')
    } catch {
      setState('error')
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel}
      data-state={state}
      className={`btn ${className}`}
    >
      {state === 'done' ? (
        <Check size={15} weight="bold" aria-hidden />
      ) : state === 'error' ? (
        <Warning size={15} weight="bold" aria-hidden />
      ) : (
        <Copy size={15} weight="bold" aria-hidden />
      )}
      <span aria-live="polite">
        {state === 'done' ? '已复制' : state === 'error' ? '复制失败' : label}
      </span>
    </button>
  )
}
