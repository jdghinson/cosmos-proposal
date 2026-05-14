export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 31) / 28}
      viewBox="0 0 28 31"
      fill="currentColor"
      aria-label="Cosmos"
    >
      <circle cx="14" cy="4.5" r="4.5" />
      <circle cx="14" cy="26.5" r="4.5" />
      <circle cx="4.5" cy="10" r="4.5" />
      <circle cx="23.5" cy="21" r="4.5" />
      <circle cx="23.5" cy="10" r="4.5" />
      <circle cx="4.5" cy="21" r="4.5" />
    </svg>
  );
}
