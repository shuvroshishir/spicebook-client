import Banner from "@/components/pages/home/Banner";
import FeaturedRecipes from "@/components/pages/home/FeaturedRecipes";
import PopularRecipes from "@/components/pages/home/PopularRecipes";
import HowSpiceBookWorks from "../../components/pages/home/HowSpiceBookWorks";
import Newsletter from "@/components/pages/home/Newsletter";
import WhyChooseSpiceBook from "@/components/pages/home/WhyChooseSpiceBook";


export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedRecipes />
      <PopularRecipes />
      <WhyChooseSpiceBook />
      <HowSpiceBookWorks />
      <Newsletter />
    </div>
  );
}
