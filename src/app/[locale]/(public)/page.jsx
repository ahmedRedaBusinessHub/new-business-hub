import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import {
  ContactFormPage,
  ProductFormPage,
  RegistrationFormPage,
} from "@/components/features/TestForm";
import DataTable from "@/components/shared/DataTable";
import HomePage from "@/components/features/HomePage";
export default function Home() {
  return <HomePage />;
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white space-y-6 px-4">
          <h1 className="text-5xl leading-20 md:text-6xl font-bold">
            Empowering Saudi Entrepreneurs
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Join our accelerator program and turn your innovative ideas into
            successful businesses. We provide mentorship, resources, and support
            to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply-accelerator">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Applying for an accelerator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-white/10 backdrop-blur border-white text-white hover:bg-white/20"
            >
              Adoption request
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
          <div className="relative">
            <div className="  carousel-container  ">
              <div className="flex carousel-track animate-[scroll-left_5s_linear_infinite]">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className=" flex-shrink-0 w-48 h-24 bg-white rounded-lg shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-110 carousel-image"
                  >
                    <span className="text-gray-400 font-semibold">
                      Partner {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Incubators Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">
              Business Incubators & Accelerators
            </h2>
            <p className="text-lg text-muted-foreground">
              Our program is designed to nurture startups from ideation to
              market success. We provide comprehensive support including
              mentorship, funding opportunities, workspace, and access to a
              network of industry experts and investors.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Mentorship</h3>
                <p className="text-muted-foreground">
                  Expert guidance from successful entrepreneurs
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Funding</h3>
                <p className="text-muted-foreground">
                  Access to investors and funding opportunities
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Resources</h3>
                <p className="text-muted-foreground">
                  Workspace, tools, and infrastructure support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Should Know Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            What You Should Know
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Eligibility Criteria
              </h3>
              <p className="text-muted-foreground">
                Open to Saudi nationals and residents with innovative business
                ideas. Must demonstrate commitment and passion for
                entrepreneurship.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Program Duration</h3>
              <p className="text-muted-foreground">
                The accelerator program runs for 3-6 months with intensive
                mentoring and workshops.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Application Process
              </h3>
              <p className="text-muted-foreground">
                Submit your application online, attend interview sessions, and
                present your pitch to our panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stages of an Idea Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Stages of an Idea
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
              {[
                {
                  step: 1,
                  title: "Ideation",
                  desc: "Develop and refine your business concept",
                },
                {
                  step: 2,
                  title: "Validation",
                  desc: "Test your idea with potential customers",
                },
                {
                  step: 3,
                  title: "Prototyping",
                  desc: "Build your minimum viable product",
                },
                {
                  step: 4,
                  title: "Launch",
                  desc: "Bring your product to market",
                },
                {
                  step: 5,
                  title: "Growth",
                  desc: "Scale your business and reach new markets",
                },
              ].map((stage, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        Step {stage.step}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-muted-foreground">{stage.desc}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graduation Projects Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Graduation Projects
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">
                    Project {i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Latest News</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    News Headline {item}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Brief description of the news item goes here. This is a
                    placeholder for actual news content.
                  </p>
                  <a href="#" className="text-blue-600 hover:underline">
                    Read more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactFormPage />
      <RegistrationFormPage />

      <ProductFormPage />
      <DataTable />
    </div>
  );
}
