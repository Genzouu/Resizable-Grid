import { useSelector } from "react-redux";
import { StateType } from "../redux/reducers";
import "../styles/App.scss";
import Grid from "./Grid";
import Overlay from "./Overlay";

export default function App() {
   const fieldModalStates = useSelector((state: StateType) => state.gridInfo.modalStates);

   return (
      <div className="app">
         <Grid />
         {fieldModalStates.add || fieldModalStates.edit ? <Overlay /> : null}
      </div>
   );
}
