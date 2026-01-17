export function Hero() {
  return (
    <div className='p-[60px] bg-primary-500 flex items-center justify-between flex-wrap sm:gap-7'>
      <div className="max-w-[589px]">
        <h1 className="font-black text-[36px]">Your Pull Requests,<br />Professionally Summarized</h1>
        <p className="text-[18px]">Generate AI-powered summaries of your GitHub contributions. Perfect for performance reviews, promotions, or showcasing your impact.</p>
      </div>

      <img src="/images/hero.png" alt="Pen resting on a blank page of spiral bound book" />
    </div>
  )
}
