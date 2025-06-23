import Header1 from "./components/header1.jsx";
import Options1 from "./components/options1.jsx";
import CarouselSelector from "./components/carouselselector.jsx";
import './App.css';
import "leaflet/dist/leaflet.css";


function App() {
  return (
    <>
      <Header1 />
      {/* <Options1 /> */}
      <CarouselSelector />

      {/* <ExcelUploadTable /> */}
    </>
  );
}

export default App;