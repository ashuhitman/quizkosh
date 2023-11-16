import React from "react";
import Header from "../Header/Header";
import "./HomePageLoader.css";
import LoaderCard from "./LoaderCard";

function HomePageLoader() {
  return (
    <div>
      <div className="test-container">
        <LoaderCard />
        <LoaderCard />
        <LoaderCard />
        <LoaderCard />
        <LoaderCard />
        <LoaderCard />
      </div>
    </div>
  );
}

export default HomePageLoader;
