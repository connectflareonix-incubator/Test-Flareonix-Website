// Flareonix Global Constants — single source of truth for the entire app
// Most are overridden by /api/settings (admin-editable). These act as defaults.

// Brand
export const BRAND_NAME = "Flareonix";
export const TAGLINE = "Rise. Ignite. Conquer.";
export const MISSION =
  "Flareonix is India's youth-powered startup incubator and growth ecosystem — built to discover raw talent, ignite bold ideas, and scale the next generation of founders from Tier 2 and Tier 3 cities into nationally influential businesses.";
export const DESCRIPTION =
  "Youth-powered startup incubator, growth engine, and ecosystem builder targeting founders and creators aged 16–28 across Tier 2/3 India.";

// Contact
export const CONTACT_EMAIL = "connectflareonix@gmail.com";
export const CONTACT_PHONE = "+91 9119014378";
export const CONTACT_WHATSAPP = "https://wa.me/919119014378";
export const CONTACT_ADDRESS = "Kashipur, U.S. Nagar, Uttarakhand – 244713";

// Social
export const SOCIAL_INSTAGRAM = "https://www.instagram.com/flare.onix";
export const SOCIAL_INSTAGRAM_HANDLE = "@flare.onix";
export const SOCIAL_LINKEDIN = "https://www.linkedin.com/company/flareonix-incubator";
export const SOCIAL_LINKEDIN_LABEL = "Flareonix Incubator";
export const WHATSAPP_COMMUNITY = "https://whatsapp.com/channel/0029VbBvp58F6sn3qA6mK501";
export const WHATSAPP_URL = WHATSAPP_COMMUNITY; // back-compat
export const INSTAGRAM_URL = SOCIAL_INSTAGRAM; // back-compat

// Forms / scheduling
export const CALENDLY_LINK = "https://calendly.com/connectflareonix";
export const FREELANCER_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSdeZDQDdtFPKtWM9FaPYeZNWz8m48Bj9-IUQqt70oQkE2N8Sw/viewform";
export const FOUNDER_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSf5EK_CDUtKwZFo1s9z6MeM-XIoeNfegqdODcNbCGSlRa4Lcw/viewform";
export const GOOGLE_FORM_URL = FOUNDER_FORM; // back-compat

// Logo
export const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_67b702d1-b010-4e85-8987-3c95d6ed01fa/artifacts/pvfy4vx0_IMG_0082.png";

// Palette
export const BRAND_PRIMARY = "#FF6B00";
export const BRAND_SECONDARY = "#CC2200";
export const BRAND_AMBER = "#FFB300";
export const BRAND_DARK = "#0D0D0D";
export const BRAND_WHITE = "#F5F5F5";
export const SPARK_COLORS = ["#FF6B00", "#FF8C00", "#FFB300", "#CC2200", "#FF4500"];

// Admin
export const ADMIN_EMAIL = "connectflareonix@gmail.com";
export const ADMIN_CREDENTIALS = {
  email: "connectflareonix@gmail.com",
  note: "Password: Flareonix@admin02",
};

// API
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Nav
export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Community", href: "/community" },
  { name: "Agency", href: "/agency" },
  { name: "Freelancer Hub", href: "/freelancer-hub" },
  { name: "Incubator", href: "/incubator" },
  { name: "AI Tools", href: "/ai-tools" },
  { name: "Contact", href: "/contact" },
];
