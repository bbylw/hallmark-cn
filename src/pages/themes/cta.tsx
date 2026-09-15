import { useState } from 'react'

/** 每页的行动号召。点了给一个安静的确认态，不放彩带、不弹窗。 */
export function Cta({
  label,
  done = '已记下',
  ghost,
}: {
  label: string
  done?: string
  ghost?: boolean
}) {
  const [on, setOn] = useState(false)
  return (
    <button
      type="button"
      className={ghost ? 'btn btn-ghost' : 'btn btn-primary'}
      onClick={() => setOn(true)}
      disabled={on}
      aria-live="polite"
    >
      {on ? done : label}
    </button>
  )
}
