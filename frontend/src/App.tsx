import { Input } from "./components/ui/Input";
import { SelectButton } from "./components/ui/SelectButton";
import { AddButton } from "./components/ui/AddButton";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-10">
      <Input
        label="EMAIL"
        placeholder="Enter your name"
      />

      <Input
        label="PASSWORD"
        placeholder="Enter your password"
        error="Error message"
      />

      <SelectButton>Select</SelectButton>

      <SelectButton isLoading>Select</SelectButton>

      <AddButton>Add</AddButton>

      <AddButton isLoading>Add</AddButton>
    </div>
  )
}

export default App
