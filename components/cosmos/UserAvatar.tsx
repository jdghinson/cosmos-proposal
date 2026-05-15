import { currentUser } from "@/lib/user";

export function UserAvatar({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-label="Avatar"
      className={`rounded-full ${className}`}
      style={{
        height: size,
        width: size,
        background: currentUser.avatarGradient,
      }}
    />
  );
}
