import fs from "fs";
import path from "path";
import { Role, PublishStatus, EnquiryStatus, MessageStatus } from "@prisma/client";

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
  assignedToId?: string;
  followUpDate?: string;
  internalNotes?: string;
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
}

const STORE_PATH = path.resolve(process.cwd(), "src/data/db-store.json");

// Default initial seeded database
const INITIAL_STORE: DBStore = {
  users: [
    {
      id: "usr_superadmin_01",
      email: "admin@flashsolar.org",
      // Bcrypt hash for "FlashSolar2026!"
      passwordHash: "$2b$12$7r7Uhjo2CnsLvauG5h9yKOlxt7WcvNQRY4bPT0L8e60wmWdb6jFGG",
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
      passwordHash: "$2b$12$7r7Uhjo2CnsLvauG5h9yKOlxt7WcvNQRY4bPT0L8e60wmWdb6jFGG",
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
      key: "system_currency",
      value: "USD",
      description: "Standard currency code",
      group: "general",
      updatedAt: new Date().toISOString(),
    },
  ],
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
      fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_STORE, null, 2), "utf-8");
      return INITIAL_STORE;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw) as DBStore;
  } catch (err) {
    console.error("Failed to read database store, using fallback:", err);
    return INITIAL_STORE;
  }
}

export function writeStore(store: DBStore): void {
  try {
    ensureStoreDir();
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database store:", err);
  }
}

export const db = {
  // Products
  getProducts: () => readStore().products,
  getProductBySlug: (slug: string) => readStore().products.find((p) => p.slug === slug),
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

  // Enquiries
  getEnquiries: () => readStore().enquiries,
  getEnquiryById: (id: string) => readStore().enquiries.find((e) => e.id === id),
  saveEnquiry: (enquiry: Omit<DBEnquiry, "id" | "referenceNumber" | "createdAt" | "updatedAt"> & { id?: string; referenceNumber?: string }) => {
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
  updateEnquiryStatus: (id: string, status: EnquiryStatus, internalNotes?: string, assignedToId?: string) => {
    const store = readStore();
    const idx = store.enquiries.findIndex((e) => e.id === id);
    if (idx >= 0) {
      store.enquiries[idx].status = status;
      if (internalNotes !== undefined) store.enquiries[idx].internalNotes = internalNotes;
      if (assignedToId !== undefined) store.enquiries[idx].assignedToId = assignedToId;
      store.enquiries[idx].updatedAt = new Date().toISOString();
      writeStore(store);
      return store.enquiries[idx];
    }
    return null;
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

  // Resources
  getResources: () => readStore().resources,
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

  // Users & Auth
  getUserByEmail: (email: string) => readStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  getUserById: (id: string) => readStore().users.find((u) => u.id === id),
  getUsers: () => readStore().users.map(({ passwordHash: _, ...u }) => u),

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
    // Keep max 200 logs
    if (store.auditLogs.length > 200) store.auditLogs.pop();
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
    // Keep max 1000 events in memory store
    if (store.analytics.length > 1000) store.analytics.pop();
    writeStore(store);
    return newEvt;
  },

  // Settings
  getSettings: () => readStore().settings,
  updateSetting: (key: string, value: string) => {
    const store = readStore();
    const idx = store.settings.findIndex((s) => s.key === key);
    if (idx >= 0) {
      store.settings[idx].value = value;
      store.settings[idx].updatedAt = new Date().toISOString();
    } else {
      store.settings.push({ key, value, group: "general", updatedAt: new Date().toISOString() });
    }
    writeStore(store);
  },
};
