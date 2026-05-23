interface TagProps {
  children: React.ReactNode;
  color?: string;
}

export default function Tag({ children, color }: TagProps) {
  return (
    <span
      className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-border-light"
      style={{
        background: color ? `${color}15` : 'var(--color-accent-bg)',
        color: color || 'var(--color-text-muted)',
        borderColor: color ? `${color}30` : undefined,
      }}
    >
      {children}
    </span>
  );
}
