import type { UsageCardData } from "@/lib/types";

type UsageCardProps = UsageCardData & {
  stepNumber: number;
};

export function UsageCard({ stepNumber, title, description, iconUrl }: UsageCardProps) {
  return (
    <div className="rounded-2xl bg-accent px-[24px] py-[28px] flex flex-col items-center text-center w-[250px] h-[330px]">
      <div className="w-[56px] h-[56px] rounded-full bg-primary flex items-center justify-center mb-8">
        <span className="font-bold text-[24px]">{stepNumber}</span>
      </div>
      <img src={iconUrl} alt={title} className="w-[68px] h-[68px] mb-6" />
      <h3 className="text-[20px] font-bold mb-2 text-background">{title}</h3>
      <p className="text-[16px] text-background/80">{description}</p>
    </div>
  )
}
