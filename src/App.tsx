import { useDesktop } from "./context/DesktopContext";
import BootSequence from "./components/BootSequence";
import LockScreen from "./components/LockScreen";
import Desktop from "./components/Desktop";

function App() {
  const { state } = useDesktop();

  switch (state.phase) {
    case "boot":
      return <BootSequence />;
    case "lock":
      return <LockScreen />;
    case "desktop":
      return <Desktop />;
    default:
      return <BootSequence />;
  }
}

export default App;
