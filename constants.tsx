
import React from 'react';
import { Sun, Moon, Gem, Feather, Droplets, Eye, Sparkles, GraduationCap, Flame, Zap, MapPin, Heart } from 'lucide-react';
import { Service, Product } from './types';

export const PHONE_NUMBER = "919732913487";
export const WA_GROUP_LINK = "https://chat.whatsapp.com/KXHCsm2xEayL8o5QuAHU7k?mode=gi_t";

export const IMAGES = {
  PORTRAIT: "https://iili.io/q22iIEv.md.jpg", 
  HERO_BG: "https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?q=80&w=2000&auto=format&fit=crop", 
  POINTING_PROFILE: "https://i.postimg.cc/t4Gndx8T/ajay-pointing.png",
  
  MASTERY_1: "https://iili.io/Blu9v9V.md.png",
  MASTERY_2: "https://iili.io/q22Z99V.md.jpg",
  MASTERY_3: "https://iili.io/q22Qr8l.md.jpg",
  
  PROD_REIKI: "https://iili.io/q2KHF8F.md.png",
  PROD_LAMA: "https://iili.io/q2KH23P.md.jpg",
  PROD_MONEY: "https://iili.io/q2KH3a1.md.jpg"
};

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=100063737019131&mibextid=ZbWKwL",
  instagram: "https://www.instagram.com/grand_master_azoy/",
  youtube: "https://www.youtube.com/@ReikiKnowledgeAjayKumarDutta/videos",
  website: "https://www.reikiknowledgeakd.in",
  googleMaps: "https://goo.gl/maps/wjQTE4JLTW34oinA7",
  lineage: "https://www.photo-pick.com/online/DKr5aT7b.link"
};

export const SERVICES: Service[] = [
  {
    id: 'holyfire-master',
    icon: <Flame className="w-8 h-8" />,
    title: "Usui/Holy Fire® III World Peace Reiki",
    desc: "Divine Outcome: Learn 1st, 2nd, ART, and Master Teacher degrees. Achieve absolute peace and medicine-free healing.",
    fullDesc: "Authorized training for Usui/Holy Fire® III World Peace Reiki Master Teacher levels."
  },
  {
    id: 'lamafera',
    icon: < Zap className="w-8 h-8" />,
    title: "Lama Fera Master Teacher",
    desc: "Divine Outcome: Master the world's fastest healing technique. Clear negative energies and entities instantly.",
    fullDesc: "Tibetan Lama Fera Master Healer and Master Teacher degrees."
  },
  {
    id: 'money-reiki-gm',
    icon: <Droplets className="w-8 h-8" />,
    title: "Money Reiki Grand Master",
    desc: "Divine Outcome: Heal your financial DNA. practitioner, Master, and Grand Master levels for prosperity.",
    fullDesc: "Comprehensive Money Reiki training from Practitioner to Grand Master levels."
  },
  {
    id: 'numerology-chaldean',
    icon: <Gem className="w-8 h-8" />,
    title: "Advanced Chaldean Numerology",
    desc: "Divine Outcome: Name alignment and signature analysis to unlock hidden doors of success and wealth.",
    fullDesc: "Basic to Advanced Chaldean Numerology courses."
  },
  {
    id: 'angel-master',
    icon: <Feather className="w-8 h-8" />,
    title: "Angel Healing Master Degree",
    desc: "Divine Outcome: Communicate with celestial beings. Learn Angel Codes, Zibu Symbols, and Switchwords.",
    fullDesc: "Basic, Advanced, and Master Degree in Angel Therapy."
  },
  {
    id: 'loa-manifestation',
    icon: <Eye className="w-8 h-8" />,
    title: "Law of Attraction Mastery",
    desc: "Divine Outcome: Subconscious reprogramming for manifesting your desires and wish fulfillment.",
    fullDesc: "Law of Attraction workshops and manifestation techniques."
  },
  {
    id: 'crystal-master',
    icon: <Sparkles className="w-8 h-8" />,
    title: "Crystal Healing Master Teacher",
    desc: "Divine Outcome: Learn Pendulum Dowsing and Shiva-Shakti crystal grids for deep spiritual clearing.",
    fullDesc: "Basic, Advanced, and Master degrees in Crystal Healing."
  },
  {
    id: 'karuna-reiki',
    icon: <Heart className="w-8 h-8" />,
    title: "Karuna Reiki® Master Teacher",
    desc: "Divine Outcome: Experience the Reiki of Compassion. Heal emotional wounds and connect with higher spiritual guides.",
    fullDesc: "Registered Karuna Reiki® Master Teacher training programs."
  },
  {
    id: 'magnified-healing',
    icon: <Sun className="w-8 h-8" />,
    title: "Magnified Healing® Master Teacher",
    desc: "Divine Outcome: A high-frequency ascension tool for clearing all bodies and building a light body.",
    fullDesc: "Magnified Healing® Master Teacher certification training."
  }
];

export const PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    title: 'Holy Fire® III World Peace Reiki', 
    img: IMAGES.PROD_REIKI,
    details: "Master the highest frequency of Reiki. Learn to teach and heal with divine peace and empowerment."
  },
  { 
    id: 'p2', 
    title: 'Lama Fera Master Teacher', 
    img: IMAGES.PROD_LAMA,
    details: "The ultimate entity clearing and protection system. Master the fastest healing technique on Earth."
  },
  { 
    id: 'p3', 
    title: 'Money Reiki Grand Master', 
    img: IMAGES.PROD_MONEY,
    details: "Transform your financial reality. Heal karmic financial blocks and manifest prosperity through sacred symbols."
  }
];

export const TRANSLATIONS = {
  en: {
    nav: ["Home", "About", "Services", "Mastery", "Oracle", "Shop"],
    bookBtn: "Join Family",
    heroTitle: "Universal Touch Healing & Meditation Family",
    heroSub: "Aajay Kumar Datt • Reiki Grand Master, Affiliated Member of ICRT, USA",
    heroQuote: "\"Learn Japanese 'Touch Therapy' for physical, mental, and financial freedom without medicine.\"",
    exploreService: "Explore Knowledge",
    aboutTitle: "A Vessel for Cosmic Healing",
    aboutDesc: "Welcome to Reiki Knowledge Aajay Kumar Datt. Recover from any physical, mental, or financial problem through the sacred power of Usui/Holy Fire® III Reiki and Lama Fera. Join our Universal Touch Healing family.",
    masteryTitle: "Advanced Mastery Training",
    masteryDesc: "Affiliate Member of RMA-ICRT, USA. We offer authorized certifications for Holy Fire® III World Peace Reiki, Money Reiki Grand Master, and more.",
    servicesTitle: "Divine Healing & Teaching",
    servicesDesc: "Embark on a medicine-free journey to wellness through these specialized sacred modalities.",
    productsTitle: "Divine Mastery Courses",
    footerDesc: "Empowering your health and spiritual peace through the science of energy healing.",
    beginBtn: "Start Healing",
    learnMore: "WhatsApp for Details",
    langLabel: "EN",
    ytLabel: "Visit YouTube Channel"
  },
  bn: {
    nav: ["হোম", "পরিচিতি", "পরিষেবা", "মাস্টারি", "দৈববাণী", "কোর্স"],
    bookBtn: "যুক্ত হোন",
    heroTitle: "ইউনিভার্সাল টাচ হিলিং এবং মেডিটেশন ফ্যামিলি",
    heroSub: "অজয় কুমার দত্ত • রেইকি গ্র্যান্ড মাস্টার, অ্যাফিলিয়েটেড মেম্বার অফ ICRT, USA",
    heroQuote: "\"ওষুধ ছাড়াই শারীরিক, মানসিক এবং আর্থিক স্বাধীনতার জন্য জাপানি 'টাচ থেরাপি' শিখুন।\"",
    exploreService: "জ্ঞান অন্বেষণ করুন",
    aboutTitle: "মহাজাগতিক নিরাময়ের মাধ্যম",
    aboutDesc: "রেইকি নলেজ অজয় কুমার দত্তে আপনাকে স্বাগতম। উসুই/হোলি ফায়ার® III রেইকি এবং লামা ফেরার পবিত্র শক্তির মাধ্যমে যেকোনো শারীরিক, মানসিক বা আর্থিক সমস্যা থেকে মুক্তি পান। আমাদের ইউনিভার্সাল টাচ হিলিং পরিবারে যোগ দিন।",
    masteryTitle: "উন্নত মাস্টারি ট্রেনিং",
    masteryDesc: "RMA-ICRT, USA-এর অ্যাফিলিয়েট মেম্বার। আমরা হোলি ফায়ার® III ওয়ার্ল্ড পিস রেইকি, মানি রেইকি গ্র্যান্ড মাস্টার এবং আরও অনেক কিছুর জন্য স্বীকৃত সার্টিফিকেট প্রদান করি।",
    servicesTitle: "ঐশ্বরিক নিরাময় এবং শিক্ষা",
    servicesDesc: "এই বিশেষ পবিত্র মাধ্যমগুলোর মাধ্যমে সুস্থতার দিকে ওষুধমুক্ত যাত্রা শুরু করুন।",
    productsTitle: "ঐশ্বরিক মাস্টারি কোর্স",
    footerDesc: "শক্তি নিরাময় বিজ্ঞানের মাধ্যমে আপনার স্বাস্থ্য এবং আধ্যাত্মিক শান্তি নিশ্চিত করা।",
    beginBtn: "নিরাময় শুরু করুন",
    learnMore: "বিস্তারিত জানতে হোয়াটসঅ্যাপ করুন",
    langLabel: "বাংলা",
    ytLabel: "ইউটিউব চ্যানেল ভিজিট করুন"
  }
};
