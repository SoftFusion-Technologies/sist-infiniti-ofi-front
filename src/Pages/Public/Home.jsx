import Ubication from "../../components/Ubication";
import PlanesDePrecios from "../../components/PlanesDePrecios";
import SeparadorDecorativo from "../../components/SeparadorDecorativo";
import SeccionTestimonios from "../../components/SeccionTestimonios";
import HeroSection from "../../components/HeroSection";
import FeaturesSection from "../../components/FeaturesSection";
import EntranamientosAdaptan from "../../components/EntranamientosAdaptan";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white">
      <HeroSection />
      <SeparadorDecorativo
        variant="diagonal"
        opacity={0.4}
        direction="up"
        height="medium"
        colorStart="#1f2937"
        colorEnd="#4b5563"
      />
      <EntranamientosAdaptan />
      <SeparadorDecorativo
        variant="wave"
        opacity={0.4}
        direction="up"
        height="medium"
        colorStart="#1f2937"
        colorEnd="#4b5563"
      />
      <FeaturesSection />
      <SeparadorDecorativo
        variant="diagonal"
        opacity={0.4}
        colorStart="#374151"
        colorEnd="#6b7280"
      />
      <PlanesDePrecios />
      <SeparadorDecorativo
        variant="wave"
        colorStart="#701a75"
        colorEnd="#c084fc"
        speed="fast"
      />
      <SeccionTestimonios />
      <SeparadorDecorativo
        variant="curve"
        direction="up"
        height="small"
        colorStart="#1f2937"
        colorEnd="#6b7280"
        opacity={0.5}
        noParticles
      />
      <Ubication />
      <SeparadorDecorativo
        variant="curve"
        direction="down"
        height="small"
        colorStart="#1f2937"
        colorEnd="#6b7280"
        opacity={0.5}
        noParticles
      />
    </div>
  );
};

export default Home;
