import { FilterCriteria } from "@/components/app/FilterCriteria";
import { useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  return (
    <div className="bg-background text-foreground">
      <FilterCriteria
        loading={loading}
        setLoading={setLoading}
        setAiResponse={setAiResponse}
      />

      <p>{aiResponse}</p>
    </div>
  );
}

export default App;
