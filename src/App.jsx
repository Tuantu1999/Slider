import { data } from "./data/mockData";
import Slider from "./Components/Slider";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Slider Component</h1>
      <Slider items={data} />
    </div>
  );
}

export default App;
