// Shared line icons for the "create" surfaces (CreateDropdown + NavMenu),
// derived from the Paper reference. Single source of truth so the two menus
// can't drift. Color via currentColor; size defaults to 20.

type IconProps = { size?: number };

export function CollectionIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        fill="currentColor"
        d="M20 7h-.875v10h1.75V7zm-3 13v-.875H7v1.75h10zM4 17h.875V7h-1.75v10zM7 4v.875h10v-1.75H7zM4 7h.875c0-1.174.951-2.125 2.125-2.125v-1.75A3.875 3.875 0 0 0 3.125 7zm3 13v-.875A2.125 2.125 0 0 1 4.875 17h-1.75A3.875 3.875 0 0 0 7 20.875zm13-3h-.875A2.125 2.125 0 0 1 17 19.125v1.75A3.875 3.875 0 0 0 20.875 17zm0-10h.875A3.875 3.875 0 0 0 17 3.125v1.75c1.174 0 2.125.951 2.125 2.125z"
      />
      <path stroke="currentColor" strokeWidth="1.75" d="M12 4v16M12 12h8" />
    </svg>
  );
}

export function ElementIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        fill="currentColor"
        d="M20 7h-.875v10h1.75V7zm-3 13v-.875H7v1.75h10zM4 17h.875V7h-1.75v10zM7 4v.875h10v-1.75H7zM4 7h.875c0-1.174.951-2.125 2.125-2.125v-1.75A3.875 3.875 0 0 0 3.125 7zm3 13v-.875A2.125 2.125 0 0 1 4.875 17h-1.75A3.875 3.875 0 0 0 7 20.875zm13-3h-.875A2.125 2.125 0 0 1 17 19.125v1.75A3.875 3.875 0 0 0 20.875 17zm0-10h.875A3.875 3.875 0 0 0 17 3.125v1.75c1.174 0 2.125.951 2.125 2.125z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        d="M11.5 7.5H8.3c-.28 0-.42 0-.527.054a.5.5 0 0 0-.218.219C7.5 7.88 7.5 8.02 7.5 8.3v3.2"
      />
    </svg>
  );
}

export function ImportIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        d="M9 4h-.2c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 6.28 4 7.12 4 8.8V9m11-5h.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C20 6.28 20 7.12 20 8.8V9M9 20h-.2c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 17.72 4 16.88 4 15.2V15m11 5h.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 17.72 20 16.88 20 15.2V15"
      />
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M12 16.5V9M15.75 12 12 8.25 8.25 12"
      />
    </svg>
  );
}
