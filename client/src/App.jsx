import LeftList from "./components/LeftList";
import RightList from "./components/RightList";

export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <LeftList />
      <RightList />
    </div>
  );
}
