import React, { useState, useEffect, useRef } from "react";
import "./carouselselector.css";

import SingleSite from "./singlesite1.jsx";
import ExcelUploadTable from "./exceluploadtable1.jsx";
import CurrentLocation from "./currentlocation1.jsx";
import Docs from "./docs.jsx";

import locationIcon from "../assets/images/location.svg";
import multilocationIcon from "../assets/images/multilocation.svg";
import currentlocationIcon from "../assets/images/currentlocation2.svg";
import documentationIcon from "../assets/images/documentation.svg";

import clickSoundFile from "../assets/sounds/click.mp3"; 

const options = [
  {
    key: "single",
    label: "Single Site",
    icon: locationIcon,
    component: <SingleSite />,
  },
  {
    key: "multiple",
    label: "Multiple Site",
    icon: multilocationIcon,
    component: <ExcelUploadTable />,
  },
  {
    key: "current",
    label: "Current Location",
    icon: currentlocationIcon,
    component: <CurrentLocation />,
  },
  {
    key: "docs",
    label: "Documentation",
    icon: documentationIcon,
    component: <Docs />,
  },
];

const CarouselSelector = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Start with NO component shown

  const clickSoundRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = new Audio(clickSoundFile);
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % options.length;
    setCurrentIndex(newIndex);
    setSelectedOption(options[newIndex].key);
    playClickSound();
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + options.length) % options.length;
    setCurrentIndex(newIndex);
    setSelectedOption(options[newIndex].key);
    playClickSound();
  };

  const handleSelect = (index, key) => {
    setCurrentIndex(index);
    setSelectedOption(key);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        <button className="arrow-button" onClick={handlePrev}>
          &lt;
        </button>

        {options.map((option, index) => (
          <div
            key={option.key}
            className={`card ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleSelect(index, option.key)}
          >
            <img src={option.icon} alt={option.label} className="card-icon" />
            <p className="card-label">{option.label}</p>
          </div>
        ))}

        <button className="arrow-button" onClick={handleNext}>
          &gt;
        </button>
      </div>

      <div className="selected-component">
        {selectedOption &&
          options.find((opt) => opt.key === selectedOption)?.component}
      </div>
    </div>
  );
};

export default CarouselSelector;