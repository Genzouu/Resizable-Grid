import "../styles/App.scss";
import Grid from "./grid/Grid";
import Overlay from "./Overlay";

export default function App() {
   return (
      <div className="app">
         <Grid />
         <Overlay />
      </div>
   );
}
