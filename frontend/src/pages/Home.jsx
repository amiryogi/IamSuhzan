import Hero from '../components/portfolio/Hero';
import Gallery from '../components/portfolio/Gallery';
import About from '../components/portfolio/About';
import Achievements from '../components/portfolio/Achievements';
import Services from '../components/portfolio/Services';
import Contact from '../components/portfolio/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Gallery featured={true} limit={6} showFilters={false} />
      <About />
      <Achievements />
      <Services />
      <Contact />
    </>
  );
};

export default Home;
