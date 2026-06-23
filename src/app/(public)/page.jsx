import Banner from "@/components/pages/home/Banner";
import HowSpiceBookWorks from "../../components/pages/home/HowSpiceBookWorks";
import Newsletter from "@/components/pages/home/Newsletter";
import WhyChooseSpiceBook from "@/components/pages/home/WhyChooseSpiceBook";


export default function Home() {
  return (
    <div>
      <Banner />
      <WhyChooseSpiceBook />
      <HowSpiceBookWorks />
      <Newsletter />

    </div>
  );
}
