import Link from "next/link";

const COLLAGE = [
  "https://picsum.photos/id/1015/120/120",
  "https://picsum.photos/id/106/120/120",
  "https://picsum.photos/id/1003/120/120",
  "https://picsum.photos/id/110/120/120",
];

export function ProfileEmpty() {
  return (
    <div className="flex flex-col items-center px-8 pt-24 text-center">
      <div className="grid h-[68px] w-[68px] grid-cols-2 grid-rows-2 overflow-hidden rounded-2xl ring-1 ring-inset ring-border">
        {COLLAGE.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className="h-full w-full object-cover" />
        ))}
      </div>
      <h2 className="mt-5 text-[18px] font-semibold tracking-[-0.36px] text-fg">
        Your taste, on display
      </h2>
      <p className="mt-1 text-[14px] tracking-[-0.28px] text-fg-muted">
        Save elements to shape your profile
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-surface px-4 py-2 text-[13px] font-medium tracking-[-0.26px] text-fg ring-1 ring-inset ring-border hover:bg-surface2"
      >
        Explore Cosmos
      </Link>
    </div>
  );
}
