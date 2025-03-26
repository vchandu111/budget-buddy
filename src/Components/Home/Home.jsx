import React from "react";
import About from "./About";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import Banner from "./Banner";
const Home = () => {
  return (
    <>
      <Banner/>
      <Features />
      <About />
          <HowItWorks />
          <Testimonials/>
    </>
  );
};

export default Home;
