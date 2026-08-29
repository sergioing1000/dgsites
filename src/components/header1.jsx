import nasaPowerLogo from "../assets/images/nasapower.jpeg";

import "./header1.css";

export default function Header() {
  return (
    <header className="site-header">
      <a
        aria-label="Solar App by DevGuards"
        className="brand-lockup"
        href="#workspace"
      >
        <img alt="NASA POWER logo" src={nasaPowerLogo} />
        <span>
          <strong>Solar / Wind</strong>
          <small>DevGuards field console</small>
        </span>
      </a>

      <div className="source-status">
        <span className="source-status__signal" aria-hidden="true" />
        <span>
          <small>Data source</small>
          <strong>NASA POWER</strong>
        </span>
      </div>

      <a
        className="header-link"
        href="https://power.larc.nasa.gov/"
        rel="noreferrer"
        target="_blank"
      >
        Source portal <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
