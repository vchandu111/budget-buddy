import React from "react";
import Banner from "./Banner";
import About from "./About";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <>
      <Banner />
      <Features />
      <About />
          <HowItWorks />
          <Testimonials/>
    </>
  );
};

export default Home;
