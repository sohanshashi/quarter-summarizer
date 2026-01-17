import { Hero } from "./components/app/Hero";
import { Navbar } from "./components/app/Navbar";
import { Usage } from "./components/app/Usage";

export function App() {
  return (
    <div className="h-full">
      <Navbar />
      <Hero />
      <Usage />
    </div>
  );
}
