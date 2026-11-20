/**
 * Modal.tsx — Accessible dialog shell.
 * role="dialog" + aria-modal, Escape to close, focus trap, scroll lock,
 * focus restoration, and a module-level stack so nested modals
 * (e.g. AI Tutor opened from the concept walkthrough) only react in the top-most one.
 */

import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  /** Accessible name of the dialog */
  label: string;
  /** Allow dismiss via overlay click / Escape */
  dismissible?: boolean;
  /** Show the built-in close (X) button when dismissible */
  showCloseButton?: boolean;
  /** 'fullscreen' fills the viewport (walkthroughs); default is a centered card */
  variant?: 'dialog' | 'fullscreen';
  /** Decorative layer rendered between the overlay and the panel */
  backdrop?: React.ReactNode;
  /** Extra classes for the panel (merged with tailwind-merge, so they can override defaults) */
  className?: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Open modals, oldest first. Only the last entry handles keyboard events.
const modalStack: symbol[] = [];

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  label,
  dismissible = true,
  showCloseButton = true,
  variant = 'dialog',
  backdrop,
  className,
  children,
}) => {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const canDismiss = dismissible && !!onClose;
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const fullscreen = variant === 'fullscreen';

  useEffect(() => {
    if (!isOpen) return;

    const me = Symbol('modal');
    modalStack.push(me);
    const isTop = () => modalStack[modalStack.length - 1] === me;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel || panel.contains(document.activeElement)) return;
      const first =
        panel.querySelector<HTMLElement>('[data-autofocus]') ?? panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isTop()) return;
      if (e.key === 'Escape' && canDismiss) {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      const idx = modalStack.indexOf(me);
      if (idx >= 0) modalStack.splice(idx, 1);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, canDismiss]);

  // Portal to <body>: ancestors with backdrop-filter/transform (e.g. the glass header) would otherwise
  // become the containing block of `position: fixed` and clip/misplace the dialog.
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx('modal-overlay font-nunito', fullscreen && '!p-0 !items-stretch !bg-transparent !backdrop-blur-none')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && canDismiss) onClose?.();
          }}
        >
          {backdrop}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: fullscreen ? 1 : 0.94, y: fullscreen ? 0 : 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: fullscreen ? 1 : 0.94, y: fullscreen ? 0 : 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={twMerge(
              clsx(
                'relative w-full outline-none',
                fullscreen
                  ? 'h-dvh max-w-none'
                  : 'max-w-lg max-h-[90dvh] overflow-y-auto bg-white border-2 border-surface-border rounded-3xl shadow-card-lg',
              ),
              className,
            )}
          >
            <span id={labelId} className="sr-only">
              {label}
            </span>
            {canDismiss && showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label={t('ui.close')}
                className="absolute top-3 right-3 z-10 min-w-11 min-h-11 inline-flex items-center justify-center rounded-full text-ink-500 hover:text-ink-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
