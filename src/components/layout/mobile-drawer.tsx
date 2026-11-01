import { useEffect, useRef, type ReactNode } from 'react'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label="Menu de navegação"
      onClose={onClose} // cobre Esc e close()
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 h-dvh max-h-none w-72 max-w-[85vw] bg-white p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm lg:hidden"
    >
      {children}
    </dialog>
  )
}