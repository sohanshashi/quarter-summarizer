import { usageCardData } from "@/lib/constants";
import { UsageCard } from "./UsageCard";

export function Usage() {
  return (
    <div className="mt-2 mb-4">
      <h1 className="text-[28px] font-bold text-center">How it works</h1>
      <div className="flex justify-center items-center gap-8 flex-wrap mt-6 py-4">
        {usageCardData.map((card, index) => (
          <UsageCard key={card.title} stepNumber={index + 1} {...card} />
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center">
        <button className="px-[16px] py-[10px] bg-primary-500 rounded-[10px] hover:bg-primary-500/90">Get Started</button>
      </div>
    </div>
  )
}
