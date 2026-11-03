import { Zap, Shield, BarChart3 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UrlShortenerForm } from './components/UrlShortenerForm';
import { FeatureCard } from './components/FeatureCard';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* URL Shortening Form (Primary Interaction) */}
        <UrlShortenerForm />

        {/* Feature Cards Section */}
        <section className="mx-auto mt-16 sm:mt-24 max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <FeatureCard
              title="Blazing Fast"
              description="Our redirection is optimized for speed, ensuring your users reach their destination instantly."
              icon={<Zap className="h-5 w-5" />}
            />
            <FeatureCard
              title="Secure & Reliable"
              description="We prioritize security. Your links are safe and always accessible when you need them."
              icon={<Shield className="h-5 w-5" />}
            />
            <FeatureCard
              title="Detailed Analytics"
              description="Track clicks, referrers, and audience location for every link you share with real-time insights."
              icon={<BarChart3 className="h-5 w-5" />}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
