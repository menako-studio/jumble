/**
 * StateMessage.tsx — EmptyState & ErrorState for data-driven views.
 */

import React from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface StateMessageProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Optional recovery action (reset filters, retry, go back…) */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const StateMessage: React.FC<StateMessageProps & { role?: 'status' | 'alert' }> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  role = 'status',
}) => (
  <div role={role} className={clsx('flex flex-col items-center text-center gap-2 px-4 py-12', className)}>
    {icon && (
      <span className="text-5xl leading-none mb-1" aria-hidden="true">
        {icon}
      </span>
    )}
    <h2 className="text-lg font-black text-ink-900">{title}</h2>
    {description && <p className="text-sm text-ink-500 max-w-sm">{description}</p>}
    {actionLabel && onAction && (
      <Button variant="secondary" size="sm" onClick={onAction} className="mt-3">
        {actionLabel}
      </Button>
    )}
  </div>
);

export const EmptyState: React.FC<StateMessageProps> = ({ icon = '📚', ...props }) => (
  <StateMessage icon={icon} {...props} />
);

export const ErrorState: React.FC<Partial<StateMessageProps> & { onRetry?: () => void }> = ({
  icon = '⚠️',
  title,
  description,
  onRetry,
  actionLabel,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <StateMessage
      role="alert"
      icon={icon}
      title={title ?? t('ui.somethingWrong')}
      description={description}
      actionLabel={onRetry ? actionLabel ?? t('ui.retry') : undefined}
      onAction={onRetry}
      className={className}
    />
  );
};
