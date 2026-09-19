export const LOCALES = ["hu", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "hu";

export const FIELDS = [
  "software_development",
  "data_ai",
  "it_ops",
  "it_security",
  "product_project_process",
  "business_analysis",
  "sales",
  "marketing",
  "customer_service",
  "finance_accounting",
  "hr",
  "legal_compliance",
  "procurement_logistics",
  "engineering",
  "manufacturing_operations",
  "healthcare",
  "education",
  "administration",
  "management",
  "other",
] as const;

export const DOMAINS = [
  "finance_banking",
  "insurance",
  "ecommerce",
  "telecommunications",
  "healthcare",
  "pharma",
  "automotive",
  "manufacturing",
  "logistics",
  "energy_utilities",
  "media_entertainment",
  "education",
  "public_sector",
  "real_estate_construction",
  "travel_hospitality",
  "other",
] as const;

export const SENIORITIES = ["junior", "medior", "senior", "lead", "head", "executive"] as const;
export const EMPLOYMENT_TYPES = ["employee", "contractor", "internship", "other"] as const;
export const SCHEDULES = ["full_time", "part_time", "shift", "flexible"] as const;
export const WORK_MODES = ["ONSITE", "HYBRID", "REMOTE"] as const;
export const COMPANY_SIZES = ["1_10", "11_50", "51_250", "251_1000", "1000_plus"] as const;
export const LANGUAGES = ["hu", "en", "de", "fr", "es", "it", "other"] as const;
export const COUNTRIES = ["HU", "AT", "SK", "RO", "RS", "DE", "UK", "US", "OTHER"] as const;

export const TECH_TAGS: Record<string, string[]> = {
  languages: [
    "Java", "Python", "C#", "JavaScript", "TypeScript", "PHP", "Go", "Rust", "C++", "C",
    "Kotlin", "Swift", "Ruby", "Scala", "R", "MATLAB", "ABAP", "COBOL",
  ],
  frontend: ["React", "Angular", "Vue", "Next.js", "HTML/CSS", "Tailwind", "React Native", "Flutter"],
  backend: ["Spring", ".NET", "Node.js", "Django", "Flask", "FastAPI", "Laravel", "Symfony", "Express", "Rails"],
  database: [
    "SQL", "PostgreSQL", "MySQL", "Oracle DB", "MS SQL Server", "MongoDB", "Redis",
    "Elasticsearch", "Snowflake", "BigQuery", "Databricks",
  ],
  cloud: [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Ansible",
    "Jenkins", "GitLab CI", "GitHub Actions", "Linux", "Windows Server", "VMware", "Git",
  ],
  data_ai: [
    "Power BI", "Tableau", "Looker", "Qlik", "Excel", "Apache Spark", "Kafka", "Airflow",
    "dbt", "TensorFlow", "PyTorch", "scikit-learn", "LLM / GenAI", "NLP", "Computer Vision", "SAS", "SPSS",
  ],
  enterprise: [
    "SAP (ERP)", "SAP S/4HANA", "Oracle ERP", "Microsoft Dynamics", "Salesforce", "HubSpot",
    "Workday", "NetSuite", "ServiceNow", "Nexon", "Kulcs-Soft",
  ],
  process: [
    "Jira", "Confluence", "Azure DevOps", "Asana", "Monday", "Trello", "Notion", "Scrum",
    "Kanban", "SAFe", "Lean", "Six Sigma", "Prince2", "PMP", "ITIL", "BPMN",
  ],
  security: ["SIEM", "Splunk", "Pentest", "ISO 27001", "GDPR", "IAM", "Network security", "Cisco", "Fortinet"],
  testing: ["Selenium", "Cypress", "Playwright", "JUnit", "Postman", "Performance testing", "Manual testing"],
  marketing: [
    "Google Ads", "Meta Ads", "LinkedIn Ads", "Google Analytics", "SEO", "SEM", "Mailchimp",
    "CRM", "Email marketing", "Copywriting",
  ],
  design: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "InDesign", "UX research", "Accessibility"],
  industrial: ["AutoCAD", "SolidWorks", "CATIA", "Revit", "ArchiCAD", "PLC", "SCADA", "Siemens TIA", "Robotics", "CNC"],
  business: [
    "IFRS", "Hungarian accounting", "Controlling", "SAP FI/CO", "Payroll", "Recruiting",
    "Labour law", "Tax law", "Public procurement",
  ],
};

export const HU_CITIES = [
  "Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr", "Nyíregyháza", "Kecskemét",
  "Székesfehérvár", "Szombathely", "Szolnok", "Tatabánya", "Kaposvár", "Békéscsaba",
  "Veszprém", "Zalaegerszeg", "Eger", "Sopron", "Dunaújváros", "Nagykanizsa",
];
