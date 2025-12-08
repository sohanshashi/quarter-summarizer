import { useState } from "react";

import { FilterCriteria } from "@/components/app/FilterCriteria";
import { ResponseTextArea } from "./components/app/ResponseTextArea";

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

      {aiResponse.length > 0 && (
        <div className="w-full px-6 py-4 space-y-2">
          <h1 className="text-2xl font-bold">Your AI Summary</h1>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-sm border border-gray-800 dark:border-gray-700 shadow-lg">
            <ResponseTextArea value={aiResponse} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
