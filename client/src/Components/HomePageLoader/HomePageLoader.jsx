import React from "react";
import Header from "../Header/Header";
import "./HomePageLoader.css";
import LoaderCard from "./LoaderCard";

function HomePageLoader() {
  return (
    <div className="test-container">
      <LoaderCard />
      <LoaderCard />
      <LoaderCard />
      <LoaderCard />
      <LoaderCard />
      <LoaderCard />
    </div>
  );
}

export default HomePageLoader;
