import Header1 from "./components/header1.jsx";
import CarouselSelector from "./components/carouselselector.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace">
        Skip to workspace
      </a>
      <Header1 />
      <main>
        <CarouselSelector />
      </main>
      <footer className="site-footer">
        <p>DevGuards · Configuration &amp; maintenance project</p>
        <p>Daily meteorological data powered by NASA POWER.</p>
      </footer>
    </div>
  );
}

export default App;
