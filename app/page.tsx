import { getMosqueSettings } from "@/lib/data/settings";
import { getUpcomingEvents }  from "@/lib/data/events";
import { getLatestNews }      from "@/lib/data/news";
import { getLatestPhotos }    from "@/lib/data/gallery";
import { getBoardMembers }    from "@/lib/data/board";

import Navbar   from "@/components/sections/Navbar";
import Hero     from "@/components/sections/Hero";
import About    from "@/components/sections/About";
import Events   from "@/components/sections/Events";
import News     from "@/components/sections/News";
import Gallery  from "@/components/sections/Gallery";
import Finance  from "@/components/sections/Finance";
import Board    from "@/components/sections/Board";
import Donation from "@/components/sections/Donation";
import Footer   from "@/components/sections/Footer";

export const revalidate = 60; // ISR: revalidate every 60s; also triggered on admin save

export default async function HomePage() {
  const [settings, events, news, photos, members] = await Promise.all([
    getMosqueSettings(),
    getUpcomingEvents(),
    getLatestNews(),
    getLatestPhotos(),
    getBoardMembers(),
  ]);

  return (
    <>
      <Navbar
        name={settings.name}
        logoUrl={settings.logo_url}
        donationUrl={settings.donation_url}
      />
      <main>
        <Hero
          name={settings.name}
          tagline={settings.tagline}
          description={settings.description}
          heroImageUrl={settings.hero_image_url}
          heroTitle={settings.hero_title}
          heroSubtitle={settings.hero_subtitle}
          donationUrl={settings.donation_url}
        />
        <About
          description={settings.description}
          address={settings.address}
        />
        <Events events={events} />
        <News articles={news} />
        <Gallery photos={photos} />
        <Finance />
        <Board members={members} />
        <Donation donationUrl={settings.donation_url} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
