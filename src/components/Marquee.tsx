// components/Marquee.tsx
interface MarqueeProps {
  items: string[];
}

export default function Marquee({ items }: MarqueeProps) {
  return (
    <div className="bg-green-700 marquee-wrapper py-2 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee space-x-8 w-max marquee-track">
        {[...items, ...items, ...items].map((item, index) => (
          <span
            key={index}
            className="text-white text-lg font-medium px-3"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
