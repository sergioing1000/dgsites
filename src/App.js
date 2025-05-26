import ExcelUploadTable from './components/exceluploadtable.jsx';
import Header from './components/header.jsx'
import './App.css';
import "leaflet/dist/leaflet.css";


function App() {
  return (
    <>
      <Header />
      <ExcelUploadTable />
    </>    
  );
}

export default App;