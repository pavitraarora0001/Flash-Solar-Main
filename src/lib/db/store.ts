import fs from "fs";
import path from "path";
import { Role, PublishStatus, EnquiryStatus, MessageStatus, LeadPriority } from "@prisma/client";

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  company?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBProductCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  displayOrder: number;
  createdAt: string;
}

export interface DBProduct {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  sku?: string;
  summary: string;
  description: string;
  status: PublishStatus;
  featured: boolean;
  displayOrder: number;
  specifications: Record<string, string>;
  features: string[];
  galleryImages: string[];
  datasheetUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBService {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  summary: string;
  description: string;
  iconName?: string;
  status: PublishStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBLeadActivity {
  id: string;
  enquiryId: string;
  userId?: string;
  userName?: string;
  type: string; // NOTE, STATUS_CHANGE, CALL, EMAIL, ASSIGNMENT, FOLLOW_UP
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DBEnquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  productOfInterest: string;
  projectType?: string;
  estimatedPowerReq?: string;
  estimatedDailyEnergy?: string;
  message: string;
  privacyConsent: boolean;
  status: EnquiryStatus;
  priority?: LeadPriority;
  assignedToId?: string;
  followUpDate?: string;
  internalNotes?: string;
  sourceReferrer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBContactMessage {
  id: string;
  referenceNumber: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBTechnicalResource {
  id: string;
  slug: string;
  title: string;
  resourceType: string;
  summary: string;
  fileUrl: string;
  fileSize?: string;
  downloadCount: number;
  status: PublishStatus;
  createdAt: string;
}

export interface DBTestimonial {
  id: string;
  authorName: string;
  authorTitle?: string;
  company?: string;
  quote: string;
  rating: number;
  verified: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface DBFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface DBAuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DBAnalyticsEvent {
  id: string;
  eventType: string;
  path: string;
  entityId?: string;
  referrer?: string;
  deviceType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DBSiteSetting {
  key: string;
  value: string;
  description?: string;
  group: string;
  updatedAt: string;
}

export interface DBMediaAsset {
  id: string;
  filename: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  category: string;
  altText?: string;
  caption?: string;
  createdAt: string;
}

export interface DBPage {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  status: PublishStatus;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBPageSection {
  id: string;
  pageId: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  badge?: string;
  content: Record<string, unknown>;
  mediaUrl?: string;
  displayOrder: number;
  isVisible: boolean;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DBEngineeringStage {
  id: string;
  stageNumber: number;
  slug: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  technicalDetails: string;
  imageUrl: string;
  voltageBus?: string;
  efficiencyMetric?: string;
  specs: Array<{ label: string; value: string }>;
  animationLabel?: string;
  displayOrder: number;
  isVisible: boolean;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DBEmailTemplate {
  id: string;
  slug: string;
  name: string;
  subject: string;
  body: string;
  senderName?: string;
  variables: string[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBBlogCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface DBBlogPost {
  id: string;
  categoryId: string;
  authorId: string;
  authorName?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: PublishStatus;
  publishedAt?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBStore {
  users: DBUser[];
  productCategories: DBProductCategory[];
  products: DBProduct[];
  services: DBService[];
  enquiries: DBEnquiry[];
  contactMessages: DBContactMessage[];
  resources: DBTechnicalResource[];
  faqs: DBFAQ[];
  auditLogs: DBAuditLog[];
  analytics: DBAnalyticsEvent[];
  settings: DBSiteSetting[];
  mediaAssets: DBMediaAsset[];
  pages: DBPage[];
  pageSections: DBPageSection[];
  engineeringStages: DBEngineeringStage[];
  emailTemplates: DBEmailTemplate[];
  testimonials: DBTestimonial[];
  blogCategories: DBBlogCategory[];
  blogPosts: DBBlogPost[];
  leadActivities: DBLeadActivity[];
}

const STORE_PATH = path.resolve(process.cwd(), "src/data/db-store.json");

// Default initial seeded database
const INITIAL_STORE: DBStore = {
  users: [
    {
      id: "usr_superadmin_01",
      email: "admin@flashsolar.org",
      passwordHash: "$2b$12$J41TRDOpvRpQXK.VSapnC.Z0ZB6YLlYoTZ2acVCwhqjN0xTlwo3TO",
      name: "Flash Solar Administrator",
      company: "Flash Solar Engineering Desk",
      role: Role.SUPER_ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_sales_01",
      email: "sales@flashsolar.org",
      passwordHash: "$2b$12$ptfEeGTAkJPtfw67b3OMPOLgeastp/PNbMRj2eQLH2KPlOAT3pfE2",
      name: "Technical Sizing Lead",
      company: "Flash Solar",
      role: Role.SALES_MANAGER,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  productCategories: [
    {
      id: "cat_storage",
      slug: "energy-storage",
      name: "Battery Energy Storage Systems",
      description: "Lithium Iron Phosphate wall-mounted and containerized battery solutions.",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat_dc",
      slug: "dc-microgrid",
      name: "Direct-Current Architecture",
      description: "Native DC electrical distribution systems operating at sub-60V safe bus.",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat_ac",
      slug: "hybrid-solar",
      name: "Hybrid AC Solar Systems",
      description: "Grid-synchronous hybrid solar architectures with automatic transfer backup.",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  products: [
    {
      id: "prod_power_wall",
      slug: "flash-power-wall",
      categoryId: "cat_storage",
      name: "Flash Power Wall",
      sku: "FS-PW-512-100",
      summary: "Dedicated residential and commercial lithium battery storage system with integrated active BMS.",
      description:
        "High-density Lithium Iron Phosphate (LiFePO4) storage engineered for residential wall-mounting and commercial parallel clustering. Designed for sub-60V DC low-voltage safety and thousands of high-depth discharge cycles.",
      status: PublishStatus.PUBLISHED,
      featured: true,
      displayOrder: 1,
      specifications: {
        "Nominal Operating Bus": "51.2 V DC",
        "Cell Chemistry": "Lithium Iron Phosphate (LiFePO4)",
        "Depth of Discharge": "Up to 90% Usable Capacity",
        "Cycle Endurance": "6,000+ Cycles @ 80% DoD",
        "Conversion Efficiency": ">95% Round-Trip Cell Efficiency",
        "Protection & BMS": "Active Cell Balancing, Thermal Cutoff, Over-Voltage Cut",
        "Clustering": "Parallel scalable up to 8 units",
      },
      features: [
        "Eliminates volatile thermal runaway risk with LiFePO4 chemistry",
        "Integrated dual-redundant BMS balancing and monitoring",
        "Direct compatibility with Flash DC bus and hybrid pure sine inverters",
        "CAN / RS485 communication protocols for live telemetry",
      ],
      galleryImages: ["/images/flash-power-wall.jpg"],
      datasheetUrl: "/docs/flash-power-wall-datasheet.pdf",
      metaTitle: "Flash Power Wall | 51.2V LiFePO4 Energy Storage",
      metaDescription: "Dedicated high-density lithium battery storage with integrated active BMS and modular scalability.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_dc_house",
      slug: "flash-dc-house",
      categoryId: "cat_dc",
      name: "Flash DC House",
      sku: "FS-DCH-SYS",
      summary: "Pure direct-current microgrid architecture eliminating inverter conversion losses.",
      description:
        "A ground-up direct-current premise distribution standard that powers 12V, 24V, and 48V appliances straight from solar and Flash Power Walls with zero AC/DC double-conversion penalty.",
      status: PublishStatus.PUBLISHED,
      featured: true,
      displayOrder: 2,
      specifications: {
        "Inverter Inversion Loss": "0.0% (Direct DC Native)",
        "Standard Bus Voltages": "12V, 24V, 48V DC Low-Voltage Safe",
        "Supported End-Loads": "BLDC Ceiling Fans, LED Arrays, DC Refrigeration",
        "Thermal Dissipation": "Minimal (No Inverter Radiators)",
        "System Autonomy Gain": "+15% to +22% vs Conventional AC",
        "Safety Classification": "Sub-60V DC Touch Safe",
      },
      features: [
        "100% of solar power flows directly into DC appliances",
        "Eliminates central inverter failure points and fire hazards",
        "Powers brushless DC fans and refrigeration with 60% lower motor draw",
        "Simplifies electrical safety compliance for domestic wiring",
      ],
      galleryImages: ["/images/dc-house.svg"],
      datasheetUrl: "/docs/dc-house-architecture-guide.pdf",
      metaTitle: "Flash DC House | Zero-Loss Pure Direct Current Microgrid",
      metaDescription: "A revolutionary direct-current residential solar standard that eliminates inverter conversion losses.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod_ac_house",
      slug: "flash-ac-house",
      categoryId: "cat_ac",
      name: "Flash AC House",
      sku: "FS-ACH-SYS",
      summary: "Resilient hybrid alternating-current system with smart inverter integration.",
      description:
        "Engineered for properties with existing 230V residential wiring. Couples high-efficiency pure sine-wave inverters with Flash Solar battery banks for uninterrupted grid synchronization and automatic blackout transfer.",
      status: PublishStatus.PUBLISHED,
      featured: true,
      displayOrder: 3,
      specifications: {
        "AC Distribution": "230V Single-Phase / 400V 3-Phase",
        "Waveform Quality": "<3% Total Harmonic Distortion (THD)",
        "Automatic Transfer Speed": "<10ms Instantaneous Switchover",
        "Battery Bank Coupling": "48V DC Flash Power Wall Compatible",
        "Grid Interaction": "Zero-Export Limiting & Peak Shaving",
        "Surge Capacity": "2.5x Rated Output for Inductive AC Starts",
      },
      features: [
        "Full backward compatibility with existing 230V home appliances",
        "Automatic transfer switch delivers millisecond blackout protection",
        "Prioritizes solar consumption while keeping utility grid fallback",
        "High surge headroom handles air conditioners and water pumps",
      ],
      galleryImages: ["/images/ac-house.svg"],
      metaTitle: "Flash AC House | Resilient Hybrid Solar Solutions",
      metaDescription: "Standard 230V alternating-current hybrid residential system with pure sine-wave inverter integration.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  services: [
    {
      id: "srv_01",
      slug: "residential-microgrids",
      categoryId: "cat_dc",
      title: "Residential DC & AC Microgrid Engineering",
      summary: "Full-scale custom engineering, load profiling, and installation design for homes.",
      description: "End-to-end electrical design for off-grid and grid-interactive residences, including conductor sizing, breaker panel integration, and solar array layout.",
      iconName: "Home",
      status: PublishStatus.PUBLISHED,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "srv_02",
      slug: "commercial-bess",
      categoryId: "cat_storage",
      title: "Commercial Battery Energy Storage Retrofitting",
      summary: "Three-phase megawatt-hour containerized storage for commercial and industrial facilities.",
      description: "Displaces expensive diesel generators and mitigates utility demand tariffs with high-capacity containerized LiFePO4 battery energy storage systems (BESS).",
      iconName: "Building2",
      status: PublishStatus.PUBLISHED,
      displayOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "srv_03",
      slug: "battery-sizing-assembly",
      categoryId: "cat_storage",
      title: "Custom Battery Bank Sizing & Assembly",
      summary: "Engineered 48V modular battery assemblies customized to specific inductive duty cycles.",
      description: "Individual cell grading, BMS configuration, and thermal enclosure assembly for agricultural, telecom, and marine microgrids.",
      iconName: "BatteryCharging",
      status: PublishStatus.PUBLISHED,
      displayOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "srv_04",
      slug: "diagnostics-auditing",
      categoryId: "cat_dc",
      title: "Preventative Diagnostics & Thermal Audits",
      summary: "Specialized harmonic analysis, thermal imaging, and conductor integrity audits.",
      description: "On-site and remote diagnostic evaluations identifying hot spots, loose connections, and inverter harmonic distortion in mission-critical solar installations.",
      iconName: "Gauge",
      status: PublishStatus.PUBLISHED,
      displayOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  enquiries: [
    {
      id: "enq_demo_01",
      referenceNumber: "FS-2026-1001",
      fullName: "Marcus Vance",
      company: "Vance Agro Facilities",
      email: "marcus@vanceagro.com",
      phone: "+1 (555) 349-2910",
      country: "United States",
      city: "Austin, TX",
      productOfInterest: "Flash DC House",
      projectType: "Agricultural / Remote Pumping",
      estimatedPowerReq: "15 kW DC",
      estimatedDailyEnergy: "45 kWh/day",
      message: "Interested in running deep-well submersible water pumps directly from 48V DC solar without central inverters.",
      privacyConsent: true,
      status: EnquiryStatus.QUALIFIED,
      priority: LeadPriority.HIGH,
      assignedToId: "usr_sales_01",
      followUpDate: "2026-12-05",
      internalNotes: "Verified customer requirement. Provided preliminary sizing schematic for 3x Flash Power Wall clustering.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "enq_demo_02",
      referenceNumber: "FS-2026-1002",
      fullName: "Dr. Sarah Lin",
      company: "Lin Estate Residence",
      email: "slin@residencemail.org",
      phone: "+44 20 7946 0912",
      country: "United Kingdom",
      city: "Surrey",
      productOfInterest: "Flash Power Wall",
      projectType: "Residential Storage",
      estimatedPowerReq: "10 kW",
      estimatedDailyEnergy: "28 kWh/day",
      message: "Looking to install 2 units of Flash Power Wall to store excess 8kWp rooftop solar generation and provide blackout resilience.",
      privacyConsent: true,
      status: EnquiryStatus.NEW,
      priority: LeadPriority.MEDIUM,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  contactMessages: [
    {
      id: "msg_01",
      referenceNumber: "MSG-2026-081",
      name: "Engineering Desk Inquiry",
      email: "tech@solardistributors.eu",
      phone: "+49 30 123456",
      subject: "BMS Telemetry Documentation",
      message: "Can you provide the CAN bus DBC files and RS485 register mapping for the Flash Power Wall?",
      status: MessageStatus.UNREAD,
      internalNotes: "Forward to firmware and hardware engineering team.",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  resources: [
    {
      id: "res_01",
      slug: "flash-power-wall-datasheet",
      title: "Flash Power Wall Technical Datasheet",
      resourceType: "DATASHEET",
      summary: "Detailed electrical discharge curves, thermal operating limits, BMS protocols, and physical dimensions.",
      fileUrl: "/docs/flash-power-wall-datasheet.pdf",
      fileSize: "2.4 MB",
      downloadCount: 42,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res_02",
      slug: "dc-house-architecture-guide",
      title: "Direct-Current House Architecture Guide",
      resourceType: "WHITEPAPER",
      summary: "System schematic for sub-60V DC residential distribution, wire gauge tables, and BLDC motor calculations.",
      fileUrl: "/docs/dc-house-architecture-guide.pdf",
      fileSize: "4.1 MB",
      downloadCount: 88,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
    },
  ],
  faqs: [
    {
      id: "faq_01",
      category: "DC Engineering",
      question: "What is the primary engineering difference between Flash DC House and conventional AC solar?",
      answer: "Conventional solar systems generate Direct Current (DC), invert it to 230V Alternating Current (AC) using a central inverter, and then consumer appliances convert it back to DC via internal rectifiers, wasting 15% to 22% of solar power as heat. The Flash DC House uses a native direct-current bus to feed DC brushless appliances straight from the battery with zero inverter conversion loss.",
      displayOrder: 1,
      isPublished: true,
    },
    {
      id: "faq_02",
      category: "Flash Power Wall",
      question: "Can the Flash Power Wall integrate with standard 230V hybrid AC inverters?",
      answer: "Yes. While Flash Solar champions direct DC microgrids for maximum efficiency, the Flash Power Wall operates on a standard 48V/51.2V DC low-voltage battery bus and seamlessly integrates with compatible pure sine-wave hybrid inverters for properties with existing AC wiring.",
      displayOrder: 2,
      isPublished: true,
    },
  ],
  auditLogs: [
    {
      id: "log_01",
      userId: "usr_superadmin_01",
      userName: "Flash Solar Administrator",
      action: "SYSTEM_INITIALIZATION",
      entityType: "System",
      entityId: "platform",
      metadata: { status: "Platform initialized with verified products and admin accounts" },
      createdAt: new Date().toISOString(),
    },
  ],
  analytics: [
    {
      id: "evt_01",
      eventType: "PAGE_VIEW",
      path: "/",
      deviceType: "desktop",
      createdAt: new Date().toISOString(),
    },
  ],
  settings: [
    {
      key: "site_name",
      value: "Flash Solar",
      description: "Official platform brand name",
      group: "general",
      updatedAt: new Date().toISOString(),
    },
    {
      key: "contact_email",
      value: "info@flashsolar.org",
      description: "Primary company notifications and inquiries address",
      group: "email",
      updatedAt: new Date().toISOString(),
    },
    {
      key: "contact_phone",
      value: "+1 (800) 555-FLSH",
      description: "Customer service and engineering desk telephone",
      group: "general",
      updatedAt: new Date().toISOString(),
    },
    {
      key: "company_address",
      value: "Clean Energy Engineering Center, 100 Renewable Way, Suite 400",
      description: "Headquarters engineering facility",
      group: "general",
      updatedAt: new Date().toISOString(),
    },
    {
      key: "system_currency",
      value: "USD",
      description: "Standard currency code",
      group: "general",
      updatedAt: new Date().toISOString(),
    },
  ],
  mediaAssets: [
    {
      id: "med_01",
      filename: "solar-photovoltaic-generation.jpg",
      fileUrl: "/images/solar-photovoltaic-generation.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 887656,
      category: "Solar Installation",
      altText: "Commercial Solar Farm at Golden Hour with Native DC Generation",
      createdAt: new Date().toISOString(),
    },
    {
      id: "med_02",
      filename: "flash-power-wall.jpg",
      fileUrl: "/images/flash-power-wall.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 782955,
      category: "Battery Storage",
      altText: "Flash Power Wall Architectural Wall-Mounted Lithium Battery",
      createdAt: new Date().toISOString(),
    },
    {
      id: "med_03",
      filename: "logo.jpg",
      fileUrl: "/images/logo.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 25400,
      category: "Logos",
      altText: "Flash Solar Official Brand Mark",
      createdAt: new Date().toISOString(),
    },
  ],
  pages: [
    {
      id: "pg_home",
      slug: "home",
      title: "Flash Solar — Direct-Current Energy Engineering",
      summary: "Official homepage featuring direct-current architecture, Flash Power Wall, and zero-conversion loss microgrids.",
      status: PublishStatus.PUBLISHED,
      metaTitle: "Flash Solar | High-Efficiency Direct-Current Energy Architecture",
      metaDescription: "Pioneering sub-60V touch-safe direct current microgrids and high-density LiFePO4 battery energy storage systems.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pg_about",
      slug: "about",
      title: "About Flash Solar",
      summary: "Engineering leadership and vision behind pure direct-current microgrid distribution.",
      status: PublishStatus.PUBLISHED,
      metaTitle: "About Flash Solar | DC Power Engineering",
      metaDescription: "Dedicated to eliminating alternating-current conversion waste in domestic and commercial solar power.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pg_products",
      slug: "products",
      title: "Hardware & Energy Storage Systems",
      summary: "Flash Power Wall, DC House microgrids, and hybrid storage systems.",
      status: PublishStatus.PUBLISHED,
      metaTitle: "Solar & Battery Storage Hardware | Flash Solar",
      metaDescription: "Explore Flash Power Wall and scalable direct-current energy storage architectures.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pg_services",
      slug: "services",
      title: "Engineering & Turnkey Services",
      summary: "Microgrid load profiling, containerized BESS, and preventative diagnostics.",
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pg_engineering",
      slug: "engineering",
      title: "Direct-Current Architecture",
      summary: "The 5-stage direct-current energy distribution paradigm.",
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pg_contact",
      slug: "contact",
      title: "Engineering Consultation Desk",
      summary: "Direct contact with technical sizing engineers.",
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  pageSections: [
    {
      id: "sec_hero",
      pageId: "pg_home",
      sectionKey: "hero",
      title: "Direct-Current Architecture. Zero Conversion Waste.",
      subtitle: "Engineered for uncompromising industrial endurance and sub-60V safe electrical distribution.",
      badge: "Next-Gen Energy Architecture",
      content: {
        primaryCtaText: "Explore DC Journey",
        primaryCtaLink: "#dc-journey",
        secondaryCtaText: "Consult Engineering Desk",
        secondaryCtaLink: "#enquiry",
        benchmarkPillText: "High-Efficiency Clean Energy Standard",
        benchmarkTitle: "Thermodynamic Benchmark",
        benchmarkSub: "99.2% MPPT tracking coupled with direct DC low-voltage distribution.",
      },
      mediaUrl: "/images/solar-photovoltaic-generation.jpg",
      displayOrder: 1,
      isVisible: true,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  engineeringStages: [
    {
      id: "stg_01",
      stageNumber: 1,
      slug: "solar-generation",
      title: "Solar Photovoltaic Generation",
      badge: "STAGE 01 • HARVEST",
      subtitle: "100% Native DC Generation",
      description: "Utility and rooftop solar modules capture sunlight and generate pure direct-current electricity directly at source.",
      technicalDetails: "High-efficiency N-type TOPCon/HJT crystalline modules operating at optimal irradiance angles, generating steady direct-current without intermediate conversion.",
      imageUrl: "/images/solar-photovoltaic-generation.jpg",
      voltageBus: "120V - 450V DC",
      efficiencyMetric: "22.8% Module Efficiency",
      specs: [
        { label: "Nominal Operating Bus", value: "120V - 450V DC" },
        { label: "Module Technology", value: "Bifacial N-Type TOPCon" },
        { label: "Temperature Coefficient", value: "-0.30% / °C" },
        { label: "String Architecture", value: "Optimum Voltage Series" },
      ],
      animationLabel: "STAGE 01 • GENERATION",
      displayOrder: 1,
      isVisible: true,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "stg_02",
      stageNumber: 2,
      slug: "mppt-regulation",
      title: "Maximum Power Point Tracking (MPPT)",
      badge: "STAGE 02 • REGULATION",
      subtitle: "High-Speed Dynamic Power Tracking",
      description: "Digital microprocessors track the solar array's IV curve in milliseconds, maximizing energy extraction under changing cloud cover.",
      technicalDetails: "Patented high-frequency buck-boost DC-DC topologies step varying string voltages down to a stabilized bus with greater than 99% conversion efficiency.",
      imageUrl: "/images/dc-house.svg",
      voltageBus: "48V - 60V DC Regulated",
      efficiencyMetric: "99.2% MPPT Tracking",
      specs: [
        { label: "Tracking Speed", value: "<10 Milliseconds" },
        { label: "Peak Efficiency", value: "99.2% Conversion" },
        { label: "Topology", value: "Synchronous Buck-Boost" },
        { label: "Thermal Dissipation", value: "Passive Aluminum Sink" },
      ],
      animationLabel: "STAGE 02 • REGULATION",
      displayOrder: 2,
      isVisible: true,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "stg_03",
      stageNumber: 3,
      slug: "bess-storage",
      title: "Battery Energy Storage System (BESS)",
      badge: "STAGE 03 • STORAGE",
      subtitle: "Flash Power Wall Direct-Coupled Storage",
      description: "Direct-coupled LiFePO4 battery storage absorbs solar generation surpluses directly on the common DC bus with zero round-trip AC penalty.",
      technicalDetails: "Modular 51.2V architecture with active cell balancing, intelligent thermals, and 6,000+ cycle endurance at 90% depth of discharge.",
      imageUrl: "/images/flash-power-wall.jpg",
      voltageBus: "51.2V DC Nominal (48V Safe)",
      efficiencyMetric: ">95% Round-Trip Cell Efficiency",
      specs: [
        { label: "Nominal Operating Bus", value: "51.2 V DC (48V Safe)" },
        { label: "Battery Chemistry", value: "Lithium Iron Phosphate (LiFePO4)" },
        { label: "Cycle Endurance", value: "6,000+ Cycles @ 80% DoD" },
        { label: "Scalability", value: "Up to 8 Units Parallel" },
      ],
      animationLabel: "STAGE 03 • STORAGE",
      displayOrder: 3,
      isVisible: true,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "stg_04",
      stageNumber: 4,
      slug: "dc-distribution",
      title: "Direct-Current Distribution Bus",
      badge: "STAGE 04 • DISTRIBUTION",
      subtitle: "Sub-60V Touch-Safe Premise Architecture",
      description: "Centralized copper busbars route safe low-voltage direct current through building raceways, eliminating noisy inverters and fire hazards.",
      technicalDetails: "Sub-60V DC classification conforms to strict SELV (Safety Extra-Low Voltage) international electrical standards with zero shock risk.",
      imageUrl: "/images/ac-house.svg",
      voltageBus: "48V DC Touch Safe",
      efficiencyMetric: "99.8% Busbar Transmission",
      specs: [
        { label: "Safety Standard", value: "SELV Sub-60V Class 2" },
        { label: "Conductor Material", value: "Electrolytic Pure Copper" },
        { label: "Arc Fault Hazard", value: "Zero AC Inductive Plasma" },
        { label: "EMI / RFI Emission", value: "Zero High-Frequency Noise" },
      ],
      animationLabel: "STAGE 04 • DISTRIBUTION",
      displayOrder: 4,
      isVisible: true,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "stg_05",
      stageNumber: 5,
      slug: "load-applications",
      title: "High-Efficiency DC End-Loads",
      badge: "STAGE 05 • APPLICATION",
      subtitle: "Brushless Motors, LED & Critical Compute",
      description: "Modern end-use equipment consumes direct current natively: BLDC fans, refrigeration, LED drivers, computers, and EV chargers.",
      technicalDetails: "Eliminating the AC-to-DC internal rectifiers in consumer appliances reduces electricity consumption by up to 25% across all daily loads.",
      imageUrl: "/images/flash-power-wall.jpg",
      voltageBus: "12V / 24V / 48V DC Native",
      efficiencyMetric: "Up to 25% Energy Savings",
      specs: [
        { label: "Motor Technology", value: "Brushless DC (BLDC)" },
        { label: "Lighting Compatibility", value: "Direct Constant-Current LED" },
        { label: "Compute Readiness", value: "Server & Microgrid Ready" },
        { label: "Continuous Autonomy", value: "+22% Extended Runtime" },
      ],
      animationLabel: "STAGE 05 • APPLICATION",
      displayOrder: 5,
      isVisible: true,
      status: PublishStatus.PUBLISHED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  emailTemplates: [
    {
      id: "tmpl_01",
      slug: "enquiry_notification",
      name: "New Sizing Enquiry Alert",
      subject: "[New Sizing Enquiry] Ref: {{referenceNumber}} - {{customerName}} ({{productName}})",
      body: "New Flash Solar Engineering Enquiry\nReference: {{referenceNumber}}\nFull Name: {{customerName}}\nCompany: {{company}}\nEmail: {{email}}\nPhone: {{phone}}\nLocation: {{location}}\nProduct: {{productName}}\nProject Type: {{projectType}}\nEstimated Power: {{powerReq}}\nDaily Energy Demand: {{dailyEnergy}}\n\nMessage:\n{{message}}\n\nReceived: {{date}}",
      senderName: "Flash Solar Engineering Desk",
      variables: ["referenceNumber", "customerName", "company", "email", "phone", "location", "productName", "projectType", "powerReq", "dailyEnergy", "message", "date"],
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "tmpl_02",
      slug: "enquiry_confirmation",
      name: "Customer Enquiry Confirmation Receipt",
      subject: "Flash Solar Enquiry Confirmation [Ref: {{referenceNumber}}]",
      body: "Hello {{customerName}},\n\nThank you for contacting Flash Solar regarding {{productName}}.\n\nWe have received your project details and assigned reference number: {{referenceNumber}}.\nOur electrical engineering team will review your load specifications and contact you shortly.\n\nSummary of submitted information:\n- Reference: {{referenceNumber}}\n- System of Interest: {{productName}}\n- Contact Phone: {{phone}}\n\nFor urgent technical assistance, please reply to this email or contact info@flashsolar.org.\n\nWarm regards,\nFlash Solar Engineering Desk\nhttps://flashsolar.org",
      senderName: "Flash Solar Engineering Desk",
      variables: ["referenceNumber", "customerName", "productName", "phone"],
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "tmpl_03",
      slug: "contact_alert",
      name: "Contact Message Received",
      subject: "[Contact Form Message] {{subject}} - {{name}}",
      body: "New Contact Message Received\nReference: {{referenceNumber}}\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nSubject: {{subject}}\n\nMessage:\n{{message}}",
      senderName: "Flash Solar Contact Desk",
      variables: ["referenceNumber", "name", "email", "phone", "subject", "message"],
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "tmpl_04",
      slug: "lead_assignment",
      name: "Lead Assignment Notification",
      subject: "[Lead Assigned] Ref: {{referenceNumber}} - {{customerName}} ({{productName}})",
      body: "Hello {{assigneeName}},\n\nA prospective client engineering sizing enquiry has been assigned to you.\n\nLead Reference: {{referenceNumber}}\nClient Name: {{customerName}}\nCompany: {{company}}\nEmail: {{email}}\nPhone: {{phone}}\nProduct of Interest: {{productName}}\nProject Type: {{projectType}}\nEstimated Power: {{powerReq}}\nDaily Energy Demand: {{dailyEnergy}}\n\nReview and update lead status at:\nhttps://flashsolar.org/admin/enquiries?search={{referenceNumber}}\n\nFlash Solar Lead Dispatcher",
      senderName: "Flash Solar Lead Dispatcher",
      variables: ["assigneeName", "referenceNumber", "customerName", "company", "email", "phone", "productName", "projectType", "powerReq", "dailyEnergy"],
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "tmpl_05",
      slug: "password_reset",
      name: "Administrative Password Reset",
      subject: "[Flash Solar Security] Administrative Password Reset Request",
      body: "Hello {{name}},\n\nA password reset request has been initiated for your Flash Solar administrative account ({{email}}).\n\nTo reset your password, visit the following secure link (valid for 60 minutes):\n{{resetLink}}\n\nIf you did not request this password reset, please ignore this notice or contact the platform security desk immediately at info@flashsolar.org.\n\nFlash Solar Infrastructure Security\nhttps://flashsolar.org",
      senderName: "Flash Solar Security",
      variables: ["name", "email", "resetLink"],
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  testimonials: [
    {
      id: "tst_01",
      authorName: "Dr. Evelyn Reed",
      authorTitle: "Lead Microgrid Architect",
      company: "Nordic Clean Energy Consortium",
      quote: "The direct-current architecture eliminates inverter failure points completely. Our remote test laboratory achieved continuous 99.8% power availability with Flash Power Wall clustering.",
      rating: 5,
      verified: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "tst_02",
      authorName: "Liam Vance",
      authorTitle: "Chief Operations Officer",
      company: "Vance Precision Agro",
      quote: "Running deep-well water pumps on native 48V DC without a central inverter decreased our motor failure rate to zero and saved over 18% in monthly kilowatt-hour waste.",
      rating: 5,
      verified: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ],
  blogCategories: [
    {
      id: "bcat_01",
      slug: "dc-engineering",
      name: "DC Engineering & Architecture",
      description: "Thermodynamic and electrical analysis of direct-current microgrid topologies.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "bcat_02",
      slug: "battery-storage",
      name: "Battery Energy Storage",
      description: "Lithium Iron Phosphate (LiFePO4) cell chemistry, BMS protocols, and cycle longevity.",
      createdAt: new Date().toISOString(),
    },
  ],
  blogPosts: [
    {
      id: "post_01",
      categoryId: "bcat_01",
      authorId: "usr_superadmin_01",
      authorName: "Flash Solar Engineering Desk",
      slug: "direct-current-microgrids-thermodynamic-advantage",
      title: "Direct-Current Microgrids vs Traditional AC Solar: A Thermodynamic Comparison",
      excerpt: "Why inverting DC solar to AC and back to DC inside appliances introduces unacceptable thermal losses and how sub-60V DC architectures fix it.",
      content: "## The Inversion Tax\nIn conventional residential and commercial photovoltaic installations, solar panels produce direct-current (DC) power. This electricity is fed into a central inverter to produce 230V alternating current (AC). When this power reaches modern electronics—LED lighting, brushless DC motors, computing clusters, and battery chargers—it is rectified back into DC by internal power supplies.\n\nEach conversion stage sheds energy as heat, creating an aggregate thermodynamic loss between 15% and 22%.\n\n## Sub-60V Direct-Current Distribution\nBy establishing a centralized 48V/51.2V DC low-voltage bus directly from the solar array and the Flash Power Wall, power flows natively into end-loads. Conductor losses are managed via proper copper busbar cross-sections, and central inverter failure points are eliminated.\n\n## Conclusion\nFor modern energy engineering, direct current is not a legacy concept—it is the optimal engineering pathway for high-density, mission-critical renewable power.",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date().toISOString(),
      featuredImage: "/images/solar-photovoltaic-generation.jpg",
      metaTitle: "DC Microgrids vs AC Solar | Flash Solar Engineering",
      metaDescription: "Thermodynamic comparison between native direct-current microgrids and conventional AC solar.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  leadActivities: [],
};

function ensureStoreDir(): void {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readStore(): DBStore {
  try {
    ensureStoreDir();
    if (!fs.existsSync(STORE_PATH)) {
      writeStore(INITIAL_STORE);
      return INITIAL_STORE;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const store = JSON.parse(raw) as DBStore;

    // Gracefully backfill any newly added entity collections without modifying existing records
    let dirty = false;
    if (!store.users) { store.users = INITIAL_STORE.users; dirty = true; }
    if (!store.productCategories) { store.productCategories = INITIAL_STORE.productCategories; dirty = true; }
    if (!store.products) { store.products = INITIAL_STORE.products; dirty = true; }
    if (!store.services) { store.services = INITIAL_STORE.services; dirty = true; }
    if (!store.enquiries) { store.enquiries = INITIAL_STORE.enquiries; dirty = true; }
    if (!store.contactMessages) { store.contactMessages = INITIAL_STORE.contactMessages; dirty = true; }
    if (!store.resources) { store.resources = INITIAL_STORE.resources; dirty = true; }
    if (!store.faqs) { store.faqs = INITIAL_STORE.faqs; dirty = true; }
    if (!store.auditLogs) { store.auditLogs = INITIAL_STORE.auditLogs; dirty = true; }
    if (!store.analytics) { store.analytics = INITIAL_STORE.analytics; dirty = true; }
    if (!store.settings) { store.settings = INITIAL_STORE.settings; dirty = true; }
    if (!store.mediaAssets) { store.mediaAssets = INITIAL_STORE.mediaAssets; dirty = true; }
    if (!store.pages) { store.pages = INITIAL_STORE.pages; dirty = true; }
    if (!store.pageSections) { store.pageSections = INITIAL_STORE.pageSections; dirty = true; }
    if (!store.engineeringStages) { store.engineeringStages = INITIAL_STORE.engineeringStages; dirty = true; }
    if (!store.emailTemplates) { store.emailTemplates = INITIAL_STORE.emailTemplates; dirty = true; }
    if (!store.testimonials) { store.testimonials = INITIAL_STORE.testimonials; dirty = true; }
    if (!store.blogCategories) { store.blogCategories = INITIAL_STORE.blogCategories; dirty = true; }
    if (!store.blogPosts) { store.blogPosts = INITIAL_STORE.blogPosts; dirty = true; }
    if (!store.leadActivities) { store.leadActivities = INITIAL_STORE.leadActivities; dirty = true; }

    if (dirty) {
      writeStore(store);
    }

    return store;
  } catch (err) {
    console.error("Failed to read database store, using fallback:", err);
    return INITIAL_STORE;
  }
}

export function writeStore(store: DBStore): void {
  try {
    ensureStoreDir();
    const tmp = `${STORE_PATH}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2), "utf-8");
    fs.renameSync(tmp, STORE_PATH);
  } catch (err) {
    console.error("Failed to write database store:", err);
  }
}

export const db = {
  // Products
  getProducts: () => readStore().products,
  getProductBySlug: (slug: string) => readStore().products.find((p) => p.slug === slug),
  getProductById: (id: string) => readStore().products.find((p) => p.id === id),
  saveProduct: (product: DBProduct) => {
    const store = readStore();
    const idx = store.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      store.products[idx] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      store.products.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return product;
  },
  deleteProduct: (id: string) => {
    const store = readStore();
    store.products = store.products.filter((p) => p.id !== id);
    writeStore(store);
  },

  // Product Categories
  getProductCategories: () => readStore().productCategories,
  getCategories: () => readStore().productCategories,
  saveProductCategory: (category: DBProductCategory) => {
    const store = readStore();
    const idx = store.productCategories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      store.productCategories[idx] = category;
    } else {
      store.productCategories.push(category);
    }
    writeStore(store);
    return category;
  },
  deleteProductCategory: (id: string) => {
    const store = readStore();
    store.productCategories = store.productCategories.filter((c) => c.id !== id);
    writeStore(store);
  },

  // Services
  getServices: () => readStore().services,
  saveService: (service: DBService) => {
    const store = readStore();
    const idx = store.services.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      store.services[idx] = { ...service, updatedAt: new Date().toISOString() };
    } else {
      store.services.push({ ...service, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return service;
  },
  deleteService: (id: string) => {
    const store = readStore();
    store.services = store.services.filter((s) => s.id !== id);
    writeStore(store);
  },

  // Enquiries & Leads
  getEnquiries: () => readStore().enquiries,
  getEnquiryById: (id: string) => readStore().enquiries.find((e) => e.id === id),
  saveEnquiry: (enquiry: Omit<DBEnquiry, "id" | "referenceNumber" | "createdAt" | "updatedAt"> & { id?: string; referenceNumber?: string; priority?: LeadPriority }) => {
    const store = readStore();
    const isNew = !enquiry.id;
    const now = new Date().toISOString();
    const id = enquiry.id || `enq_${Date.now()}`;
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = enquiry.referenceNumber || `FS-${new Date().getFullYear()}-${randNum}`;

    const completeEnquiry: DBEnquiry = {
      ...enquiry,
      id,
      referenceNumber,
      priority: enquiry.priority || LeadPriority.MEDIUM,
      createdAt: now,
      updatedAt: now,
    };

    if (isNew) {
      store.enquiries.unshift(completeEnquiry);
    } else {
      const idx = store.enquiries.findIndex((e) => e.id === id);
      if (idx >= 0) {
        store.enquiries[idx] = { ...store.enquiries[idx], ...enquiry, updatedAt: now };
      }
    }
    writeStore(store);
    return completeEnquiry;
  },
  updateEnquiryStatus: (id: string, status: EnquiryStatus, internalNotes?: string, assignedToId?: string, priority?: LeadPriority) => {
    const store = readStore();
    const idx = store.enquiries.findIndex((e) => e.id === id);
    if (idx >= 0) {
      store.enquiries[idx].status = status;
      if (internalNotes !== undefined) store.enquiries[idx].internalNotes = internalNotes;
      if (assignedToId !== undefined) store.enquiries[idx].assignedToId = assignedToId;
      if (priority !== undefined) store.enquiries[idx].priority = priority;
      store.enquiries[idx].updatedAt = new Date().toISOString();
      writeStore(store);
      return store.enquiries[idx];
    }
    return null;
  },

  // Lead Activities
  getLeadActivities: (enquiryId: string) => {
    return (readStore().leadActivities || []).filter((a) => a.enquiryId === enquiryId);
  },
  addLeadActivity: (activity: Omit<DBLeadActivity, "id" | "createdAt">) => {
    const store = readStore();
    if (!store.leadActivities) store.leadActivities = [];
    const newAct: DBLeadActivity = {
      ...activity,
      id: `act_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.leadActivities.unshift(newAct);
    writeStore(store);
    return newAct;
  },

  // Contact Messages
  getContactMessages: () => readStore().contactMessages,
  saveContactMessage: (msg: Omit<DBContactMessage, "id" | "referenceNumber" | "createdAt" | "updatedAt">) => {
    const store = readStore();
    const id = `msg_${Date.now()}`;
    const referenceNumber = `MSG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const completeMessage: DBContactMessage = {
      ...msg,
      id,
      referenceNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.contactMessages.unshift(completeMessage);
    writeStore(store);
    return completeMessage;
  },
  updateContactMessageStatus: (id: string, status: MessageStatus, internalNotes?: string) => {
    const store = readStore();
    const idx = store.contactMessages.findIndex((m) => m.id === id);
    if (idx >= 0) {
      store.contactMessages[idx].status = status;
      if (internalNotes !== undefined) store.contactMessages[idx].internalNotes = internalNotes;
      store.contactMessages[idx].updatedAt = new Date().toISOString();
      writeStore(store);
      return store.contactMessages[idx];
    }
    return null;
  },

  // Resources
  getResources: () => readStore().resources,
  saveResource: (res: DBTechnicalResource) => {
    const store = readStore();
    const idx = store.resources.findIndex((r) => r.id === res.id);
    if (idx >= 0) {
      store.resources[idx] = res;
    } else {
      store.resources.push(res);
    }
    writeStore(store);
    return res;
  },
  deleteResource: (id: string) => {
    const store = readStore();
    store.resources = store.resources.filter((r) => r.id !== id);
    writeStore(store);
  },
  incrementResourceDownload: (slug: string) => {
    const store = readStore();
    const res = store.resources.find((r) => r.slug === slug);
    if (res) {
      res.downloadCount += 1;
      writeStore(store);
    }
  },

  // FAQs
  getFaqs: () => readStore().faqs,
  saveFaq: (faq: DBFAQ) => {
    const store = readStore();
    const idx = store.faqs.findIndex((f) => f.id === faq.id);
    if (idx >= 0) {
      store.faqs[idx] = faq;
    } else {
      store.faqs.push(faq);
    }
    writeStore(store);
    return faq;
  },
  deleteFaq: (id: string) => {
    const store = readStore();
    store.faqs = store.faqs.filter((f) => f.id !== id);
    writeStore(store);
  },

  // Testimonials
  getTestimonials: () => readStore().testimonials,
  saveTestimonial: (t: DBTestimonial) => {
    const store = readStore();
    const idx = store.testimonials.findIndex((item) => item.id === t.id);
    if (idx >= 0) {
      store.testimonials[idx] = t;
    } else {
      store.testimonials.push(t);
    }
    writeStore(store);
    return t;
  },
  deleteTestimonial: (id: string) => {
    const store = readStore();
    store.testimonials = store.testimonials.filter((t) => t.id !== id);
    writeStore(store);
  },

  // Media Library
  getMediaAssets: (category?: string) => {
    const assets = readStore().mediaAssets || [];
    if (!category || category === "All") return assets;
    return assets.filter((a) => a.category === category);
  },
  saveMediaAsset: (asset: DBMediaAsset) => {
    const store = readStore();
    if (!store.mediaAssets) store.mediaAssets = [];
    const idx = store.mediaAssets.findIndex((a) => a.id === asset.id);
    if (idx >= 0) {
      store.mediaAssets[idx] = asset;
    } else {
      store.mediaAssets.unshift(asset);
    }
    writeStore(store);
    return asset;
  },
  deleteMediaAsset: (id: string) => {
    const store = readStore();
    if (!store.mediaAssets) return;
    store.mediaAssets = store.mediaAssets.filter((a) => a.id !== id);
    writeStore(store);
  },

  // Pages & CMS
  getPages: () => readStore().pages || [],
  getPageBySlug: (slug: string) => (readStore().pages || []).find((p) => p.slug === slug),
  savePage: (page: DBPage) => {
    const store = readStore();
    if (!store.pages) store.pages = [];
    const idx = store.pages.findIndex((p) => p.id === page.id || p.slug === page.slug);
    if (idx >= 0) {
      store.pages[idx] = { ...page, updatedAt: new Date().toISOString() };
    } else {
      store.pages.push({ ...page, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return page;
  },
  deletePage: (id: string) => {
    const store = readStore();
    if (!store.pages) return;
    store.pages = store.pages.filter((p) => p.id !== id);
    writeStore(store);
  },

  // Page Sections
  getPageSections: (pageId: string) => {
    return (readStore().pageSections || []).filter((s) => s.pageId === pageId).sort((a, b) => a.displayOrder - b.displayOrder);
  },
  getSection: (pageId: string, sectionKey: string) => {
    return (readStore().pageSections || []).find((s) => s.pageId === pageId && s.sectionKey === sectionKey);
  },
  savePageSection: (section: DBPageSection) => {
    const store = readStore();
    if (!store.pageSections) store.pageSections = [];
    const idx = store.pageSections.findIndex((s) => s.id === section.id || (s.pageId === section.pageId && s.sectionKey === sectionKey(section)));
    if (idx >= 0) {
      store.pageSections[idx] = { ...section, updatedAt: new Date().toISOString() };
    } else {
      store.pageSections.push({ ...section, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return section;
  },
  deletePageSection: (id: string) => {
    const store = readStore();
    if (!store.pageSections) return;
    store.pageSections = store.pageSections.filter((s) => s.id !== id);
    writeStore(store);
  },

  // Engineering Architecture Stages
  getEngineeringStages: () => {
    return (readStore().engineeringStages || []).sort((a, b) => a.displayOrder - b.displayOrder);
  },
  getEngineeringStageByNumber: (stageNum: number) => {
    return (readStore().engineeringStages || []).find((s) => s.stageNumber === stageNum);
  },
  saveEngineeringStage: (stage: DBEngineeringStage) => {
    const store = readStore();
    if (!store.engineeringStages) store.engineeringStages = [];
    const idx = store.engineeringStages.findIndex((s) => s.id === stage.id || s.stageNumber === stage.stageNumber);
    if (idx >= 0) {
      store.engineeringStages[idx] = { ...stage, updatedAt: new Date().toISOString() };
    } else {
      store.engineeringStages.push({ ...stage, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return stage;
  },

  // Email Templates
  getEmailTemplates: () => readStore().emailTemplates || [],
  getEmailTemplateBySlug: (slug: string) => (readStore().emailTemplates || []).find((t) => t.slug === slug),
  saveEmailTemplate: (template: DBEmailTemplate) => {
    const store = readStore();
    if (!store.emailTemplates) store.emailTemplates = [];
    const idx = store.emailTemplates.findIndex((t) => t.id === template.id || t.slug === template.slug);
    if (idx >= 0) {
      store.emailTemplates[idx] = { ...template, updatedAt: new Date().toISOString() };
    } else {
      store.emailTemplates.push({ ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return template;
  },

  // Blog CMS
  getBlogPosts: () => (readStore().blogPosts || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getPosts: () => (readStore().blogPosts || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getBlogPostBySlug: (slug: string) => (readStore().blogPosts || []).find((p) => p.slug === slug),
  saveBlogPost: (post: DBBlogPost) => {
    const store = readStore();
    if (!store.blogPosts) store.blogPosts = [];
    const idx = store.blogPosts.findIndex((p) => p.id === post.id || p.slug === post.slug);
    if (idx >= 0) {
      store.blogPosts[idx] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      store.blogPosts.push({ ...post, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return post;
  },
  deleteBlogPost: (id: string) => {
    const store = readStore();
    if (!store.blogPosts) return;
    store.blogPosts = store.blogPosts.filter((p) => p.id !== id);
    writeStore(store);
  },
  getBlogCategories: () => readStore().blogCategories || [],
  saveBlogCategory: (cat: DBBlogCategory) => {
    const store = readStore();
    if (!store.blogCategories) store.blogCategories = [];
    const idx = store.blogCategories.findIndex((c) => c.id === cat.id || c.slug === cat.slug);
    if (idx >= 0) {
      store.blogCategories[idx] = cat;
    } else {
      store.blogCategories.push(cat);
    }
    writeStore(store);
    return cat;
  },

  // Users & Auth
  getUserByEmail: (email: string) => readStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  getUserById: (id: string) => readStore().users.find((u) => u.id === id),
  getUsers: () => readStore().users.map(({ passwordHash: _, ...u }) => u),
  upsertUser: (user: DBUser) => {
    const store = readStore();
    const idx = store.users.findIndex(
      (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (idx >= 0) {
      store.users[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      store.users.push({ ...user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    writeStore(store);
    return user;
  },
  deleteUser: (id: string) => {
    const store = readStore();
    store.users = store.users.filter((u) => u.id !== id);
    writeStore(store);
  },

  // Audit Logs
  getAuditLogs: () => readStore().auditLogs,
  addAuditLog: (log: Omit<DBAuditLog, "id" | "createdAt">) => {
    const store = readStore();
    const newLog: DBAuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.auditLogs.unshift(newLog);
    if (store.auditLogs.length > 300) store.auditLogs.pop();
    writeStore(store);
    return newLog;
  },

  // Analytics
  getAnalyticsEvents: () => readStore().analytics,
  addAnalyticsEvent: (event: Omit<DBAnalyticsEvent, "id" | "createdAt">) => {
    const store = readStore();
    const newEvt: DBAnalyticsEvent = {
      ...event,
      id: `evt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.analytics.unshift(newEvt);
    if (store.analytics.length > 2000) store.analytics.pop();
    writeStore(store);
    return newEvt;
  },

  // Settings
  getSettings: () => readStore().settings,
  updateSetting: (key: string, value: string, group: string = "general", description?: string) => {
    const store = readStore();
    const idx = store.settings.findIndex((s) => s.key === key);
    if (idx >= 0) {
      store.settings[idx].value = value;
      if (description) store.settings[idx].description = description;
      store.settings[idx].updatedAt = new Date().toISOString();
    } else {
      store.settings.push({ key, value, group, description, updatedAt: new Date().toISOString() });
    }
    writeStore(store);
  },
};

function sectionKey(s: DBPageSection): string {
  return s.sectionKey;
}
