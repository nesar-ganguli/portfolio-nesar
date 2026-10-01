import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { getPointerInfluence } from "./systemCanvasMotion.js";
import { usePortfolioMotion } from "./usePortfolioMotion.js";
import { ProjectArtwork } from "./ProjectArtwork.jsx";
import { ArrowDown, ArrowUpRight, Clipboard, Activity, Bug, GraduationCap, ChartColumn, Bus, Flag } from "lucide-react";
import "lenis/dist/lenis.css";
import "./styles.css";

const modes = [
  { id: "all", label: "Full Stack View" },
  { id: "sde", label: "Software Engineering" },
  { id: "de", label: "Data Engineering" },
];

const metrics = [
  ["117%", "throughput increase after Redis caching, query tuning, and backend refactoring."],
  ["30+", "weekly Airflow DAGs with retries, alerts, and recovery for procurement ingestion."],
  ["12 hrs", "researcher turnaround after replacing a 3-week manual Form 990 workflow."],
  ["4,200+", "customers supported by multi-tenant CPaaS authentication and authorization work."],
];

const flowSteps = [
  {
    title: "Raw data / client request",
    copy: "Start from public APIs, FHIR bundles, procurement sources, support tickets, or authenticated product requests. The first job is making the boundary explicit and observable.",
  },
  {
    title: "Validation and access control",
    copy: "Apply schemas, data quality checks, token validation, role-based access control, and unsupported-claim detection before the system trusts or exposes anything.",
  },
  {
    title: "Storage and retrieval layer",
    copy: "Persist the right shape of data in PostgreSQL, S3, Redis, ChromaDB, marts, or indexed code chunks so retrieval is fast, scoped, and auditable.",
  },
  {
    title: "Transform, score, or reason",
    copy: "Use dbt, Spark, Airflow, AWS Bedrock, RAG, clustering, and backend services to transform raw inputs into ranked, cited, or decision-ready outputs.",
  },
  {
    title: "API, dashboard, or workflow",
    copy: "Serve the result through secure APIs, dashboards, clinical chart review, grant scoring, GitHub issue creation, or analyst-ready datasets.",
  },
];

const projects = [
  {
    track: ["sde"],
    type: "Desktop Productivity Product",
    title: "ClipDial",
    website: "https://clipdial.nbglabs.workers.dev/",
    visual: ["Tauri", "Rust", "macOS", "Windows"],
    accent: "from-rose-100 via-white to-indigo-100 dark:from-rose-950 dark:via-slate-900 dark:to-indigo-950",
    copy: "Lightweight permanent clipboard product for saving reusable text once and pasting it anywhere with global keyboard shortcuts.",
    bullets: [
      "Built from my own job-search workflow to keep GitHub links, LinkedIn, portfolio text, phone snippets, and repeated application responses in permanent slots 0-9.",
      "Shipped a local-first desktop experience with slot management, global shortcuts, macOS builds for Apple Silicon and Intel, and Windows availability.",
      "No accounts, no cloud sync, no clipboard monitoring.",
      "Built the product website, release distribution flow, and privacy-friendly download counter for public launch.",
    ],
  },
  {
    track: ["sde", "de"],
    type: "Healthcare AI Platform",
    title: "ClinSight AI",
    repo: "https://github.com/nesar-ganguli/clinsight-ai",
    visual: ["FHIR", "RAG", "dbt", "API"],
    accent: "from-teal-100 via-white to-amber-100 dark:from-teal-950 dark:via-slate-900 dark:to-amber-950",
    copy: "Clinical chart-review platform ingesting public HL7 FHIR data, local bundles, and 2,000+ synthetic records into searchable longitudinal patient charts.",
    bullets: [
      "Grounded summaries, care gap detection, chart inconsistency checks, and evidence-backed Q&A.",
      "Normalized 6 FHIR resource types with raw tables, dbt staging, and clinical marts.",
      "Backend citation validation and 28 backend tests for trustworthy clinical workflow output.",
    ],
  },
  {
    track: ["sde"],
    type: "AI Debugging Workflow",
    title: "BugSignal AI",
    repo: "https://github.com/nesar-ganguli/BugSignal",
    visual: ["Tickets", "Clusters", "Code", "Issues"],
    accent: "from-orange-100 via-white to-blue-100 dark:from-orange-950 dark:via-slate-900 dark:to-blue-950",
    copy: "AI-powered triage system that extracts failure signals from support tickets, clusters related complaints, and links suspected root causes to code evidence.",
    bullets: [
      "Hybrid retrieval for local paths and GitHub URLs using searchable repository code chunks.",
      "HDBSCAN clustering plus impact, confidence, and urgency scoring.",
      "Human-approved GitHub issue creation and unsupported-claim detection reduced triage effort by ~55%.",
    ],
  },
  {
    track: ["sde"],
    type: "Full Stack AI Platform",
    title: "CampusHub",
    repo: "https://github.com/nesar-ganguli/campushub-platform",
    visual: ["React", "FastAPI", "AWS", "Bedrock"],
    accent: "from-sky-100 via-white to-emerald-100 dark:from-sky-950 dark:via-slate-900 dark:to-emerald-950",
    copy: "Full stack knowledge-sharing platform built with React, FastAPI, AWS, and Terraform for technical resource discovery and AI-assisted learning.",
    bullets: [
      "Launched 15+ RESTful API endpoints with sub-200ms response times and scalable cloud-backed architecture.",
      "Used AWS EC2, S3, DynamoDB, SNS, Bedrock, and Terraform across the application and infrastructure layers.",
      "Implemented an event-driven S3 workflow with SNS notifications to trigger downstream processing when new technical resources were uploaded.",
      "Integrated AWS Bedrock to generate AI-powered post summaries for faster technical resource review.",
      "Enabled context-aware Q&A so users can query posts and extract insights without reading every full resource.",
    ],
  },
  {
    track: ["de"],
    type: "Real-Time Analytics",
    title: "Ecommerce Analytics Pipeline",
    repo: "https://github.com/nesar-ganguli/realtime-ecommerce-analytics-pipeline",
    visual: ["Kafka", "Spark", "SQL", "Live"],
    accent: "from-blue-100 via-white to-teal-100 dark:from-blue-950 dark:via-slate-900 dark:to-teal-950",
    copy: "Streaming analytics pipeline with Kafka, Spark Structured Streaming, PostgreSQL, and Streamlit for live visibility into events, products, revenue, and category trends.",
    bullets: [
      "Schema-based parsing and malformed record filtering across 8 user event types.",
      "1-minute sliding windows and upsert persistence across 4 analytics tables.",
      "Dashboard surface for event trends, top products, and revenue by category.",
    ],
  },
  {
    track: ["sde"],
    type: "Hackathon · React Native Transit App",
    title: "Bloomington Transit",
    repo: "https://github.com/nesar-ganguli/realtime-transit-app",
    visual: ["GTFS", "Realtime", "Expo", "MVVM"],
    accent: "from-lime-100 via-white to-blue-100 dark:from-lime-950 dark:via-slate-900 dark:to-blue-950",
    copy: "React Native app for Bloomington Transit that shows live bus positions, routes, stop schedules, service alerts, and arrival notifications.",
    bullets: [
      "Built for a hackathon with an MVVM architecture using models, decoupled services, custom viewmodel hooks, screens, and navigation layers.",
      "Polled Bloomington Transit GTFS Realtime protobuf feeds from AWS S3 every 10 seconds for vehicle positions, trip updates, and service alerts.",
      "Bundled static GTFS data covering 15 routes, 511 stops, 1,209 trips, 28,511 stop-time records, and 5,614 shape points.",
      "Implemented route selection, color-coded stop markers, draggable bottom sheet tabs, and arrival alerts within 250m, 500m, 1km, or 2km of a stop.",
      "Collaborated with Rujul Jadav Prakash and Shashank M Lingaraju.",
    ],
  },
  {
    track: ["sde", "de"],
    type: "Full Stack Analytics Dashboard",
    title: "Formula 1 Race Analytics Dashboard",
    repo: "https://github.com/nesar-ganguli/f1-analytics",
    visual: ["Flask", "MySQL", "Chart.js", "50K+ rows"],
    accent: "from-zinc-100 via-white to-red-100 dark:from-zinc-900 dark:via-slate-900 dark:to-red-950",
    copy: "Full-stack web application for managing and analyzing Formula 1 race records with interactive insights into team, driver, circuit, and season performance.",
    bullets: [
      "Built analytics workflows over 50,000+ Formula 1 race records for team and circuit performance exploration.",
      "Delivered RESTful APIs in Flask backed by normalized MySQL schemas for efficient retrieval and modular backend services.",
      "Added query optimization and caching to support sub-second responses for user-driven analytics.",
      "Enabled insights such as fastest laps, seasonal dominance, and comparative racing performance through Chart.js visualizations.",
    ],
  },
  {
    track: ["de"],
    type: "Public Transit Analytics",
    title: "IndyGo Public Transit Dashboard",
    visual: ["Power BI", "Excel", "Python", "100K+ rows"],
    accent: "from-red-100 via-white to-amber-100 dark:from-red-950 dark:via-slate-900 dark:to-amber-950",
    copy: "Analytics dashboard project with IndyGo focused on cleaning operational transit data, visualizing ridership patterns, and improving stakeholder reporting.",
    bullets: [
      "Partnered with IndyGo to analyze raw operational datasets and clean reporting inputs in Excel, reducing manual reporting errors by ~25%.",
      "Designed and deployed Power BI dashboards over 100,000+ rows of ridership and route data.",
      "Helped stakeholders identify 20% underutilized routes and make more informed resource allocation decisions.",
      "Wrote Python preprocessing scripts that reduced dataset processing time by 40% and supported automated Power BI refreshes.",
    ],
  },
];

const experiences = [
  {
    track: ["sde", "de"],
    date: "Jan 2026 - Present",
    title: "Project 990 Inc. · Software Engineer / Data Engineer",
    copy: "Working across backend product engineering and research data infrastructure for nonprofit classification workflows.",
    bullets: [
      "Designed access control models for users, sessions, roles, and protected client workflows, translating frontend requirements into modular Flask APIs.",
      "Implemented access and refresh token authentication with RBAC-protected endpoints, reducing new client implementation effort by ~40%.",
      "Built a batch data pipeline for 3M+ IRS Form 990 records using partitioned Parquet shards and ranked nonprofit classification outputs.",
      "Automated parallel processing on IU Quartz with Slurm job arrays and merged 37 distributed outputs into a validated final dataset.",
    ],
  },
  {
    track: ["sde", "de"],
    date: "Jul 2025 - Dec 2025",
    title: "CALSTART · Software / Data Engineer Intern",
    copy: "Built procurement and grant intelligence systems that moved public-source data into reliable business workflows.",
    bullets: [
      "Engineered Python backend services for high-volume grant and bid collection, loading structured records into PostgreSQL and reducing manual gathering effort by ~60%.",
      "Designed bronze-silver PostgreSQL models for raw bid ingestion and cleaned/scored procurement records exposed to business users through NocoDB.",
      "Orchestrated 30+ weekly Airflow DAGs with retries, email alerts, and failure recovery, processing 20,000+ bid records across dedicated scrapers.",
      "Integrated AWS Bedrock scoring in 200-row batches to write relevance scores, matched keywords, and rationale back to PostgreSQL.",
    ],
  },
  {
    track: ["sde", "de"],
    date: "May 2025 - Aug 2025",
    title: "Indiana University Bloomington, School of Public Health · Data Engineer Research",
    copy: "Supported applied public-health and city-planning analysis by turning survey data into validated, dashboard-ready tables.",
    bullets: [
      "Implemented a Qualtrics-to-PostgreSQL ETL pipeline for 5,000+ IU student survey responses.",
      "Standardized city amenities feedback into analysis-ready tables for reporting and dashboard development.",
      "Built Python validation scripts using regex rules and fixed value mappings to clean free-text survey fields.",
      "Improved consistency of datasets presented to the City of Bloomington for local decision-making.",
    ],
  },
  {
    track: ["sde", "de"],
    date: "Jul 2022 - Jul 2024",
    title: "KALEYRA · Associate Software Engineer",
    copy: "Modernized and secured a multi-tenant CPaaS platform serving thousands of customers across legacy and modern stacks.",
    bullets: [
      "Led JWT authentication and RBAC implementation, enabling granular admin privileges across 4,200+ customers.",
      "Architected a RabbitMQ event streaming pipeline with producer-consumer services and message schemas, ingesting 8,000-10,000 daily user activity events into S3 for behavioral analysis.",
      "Migrated 15+ legacy PHP APIs into modular TypeScript microservices deployed on Kubernetes, improving response times by 35%.",
      "Optimized authorization services with Redis caching, query tuning, and backend refactoring, increasing throughput by 117% to 7,500+ RPM.",
      "Strengthened session management, XSS protection, and GDPR-compliant data handling, reducing reported vulnerabilities by 75% and spam activity by 80%.",
      "Maintained feature parity across React/TypeScript and Laravel/PHP codebases by standardizing API contracts during migration.",
    ],
  },
  {
    track: ["sde"],
    date: "Apr 2022 - Jul 2022",
    title: "KALEYRA · Associate Software Engineer Intern",
    copy: "Contributed to Agile product delivery while building full-stack web applications during the internship period.",
    bullets: [
      "Collaborated with stakeholders during sprint planning, daily stand-ups, and retrospectives to translate requirements into shippable product features.",
      "Built and deployed e-commerce and travel reservation web applications using React, Node.js, Express, MongoDB, MySQL, Netlify, and Heroku.",
    ],
  },
];

const skills = [
  {
    track: ["sde"],
    title: "Build Product APIs",
    copy: "FastAPI, Flask, Node.js, Laravel, REST, OpenAPI, authentication, RBAC, session security.",
  },
  {
    track: ["de"],
    title: "Move and Model Data",
    copy: "Airflow, Kafka, Spark, PySpark, dbt, ETL/ELT, data quality, bronze-silver modeling.",
  },
  {
    track: ["sde", "de"],
    title: "Store and Retrieve",
    copy: "PostgreSQL, MySQL, DuckDB, SQLite, MongoDB, DynamoDB, Redis, ChromaDB.",
  },
  {
    track: ["sde", "de"],
    title: "Ship and Operate",
    copy: "AWS, Docker, Kubernetes, Terraform, Git, CI/CD, NocoDB, Streamlit.",
  },
  {
    track: ["sde", "de"],
    title: "Ground AI Workflows",
    copy: "FHIR, SMART Health IT, AWS Bedrock, RAG, vector search, NLP, citation validation, HDBSCAN.",
  },
];

function visible(item, mode) {
  return mode === "all" || item.track.includes(mode);
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="section-heading mb-9 grid gap-7 lg:grid-cols-[0.7fr_1.3fr]">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold leading-tight tracking-normal sm:text-5xl" aria-label={title}>
        {title.split(" ").map((word, index) => <React.Fragment key={`${word}-${index}`}><span className="heading-mask" aria-hidden="true"><span className="heading-word">{word}</span></span>{" "}</React.Fragment>)}
      </h2>
    </div>
  );
}

function ProjectVisual({ project, index }) {
  const icons = [Clipboard, Activity, Bug, GraduationCap, ChartColumn, Bus, Flag, ChartColumn];
  const Icon = icons[projects.indexOf(project)] || Activity;
  return (
    <div className={`project-visual visual-${projects.indexOf(project) % 4}`} aria-hidden="true">
      <div className="visual-label"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={20} /></div>
      <ProjectArtwork title={project.title} />
      <div className="visual-caption"><span>{project.visual.join(" / ")}</span><span className="visual-dot" /></div>
    </div>
  );
}

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="currentColor"
          d="M12 18.2a6.2 6.2 0 1 1 0-12.4a6.2 6.2 0 0 1 0 12.4Zm0 3.2a1 1 0 0 1-1-1v-.9a1 1 0 1 1 2 0v.9a1 1 0 0 1-1 1Zm0-16.9a1 1 0 0 1-1-1v-.9a1 1 0 1 1 2 0v.9a1 1 0 0 1-1 1Zm9.4 8.5h-.9a1 1 0 1 1 0-2h.9a1 1 0 1 1 0 2ZM3.5 13h-.9a1 1 0 1 1 0-2h.9a1 1 0 1 1 0 2Zm14.8 6.7-.6-.6a1 1 0 0 1 1.4-1.4l.6.6a1 1 0 1 1-1.4 1.4ZM4.9 6.3l-.6-.6a1 1 0 0 1 1.4-1.4l.6.6a1 1 0 1 1-1.4 1.4Zm14.2 0a1 1 0 0 1-1.4-1.4l.6-.6a1 1 0 0 1 1.4 1.4l-.6.6ZM5.7 19.7a1 1 0 0 1-1.4-1.4l.6-.6a1 1 0 1 1 1.4 1.4l-.6.6Z"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M20.6 15.5a8.3 8.3 0 0 1-12-9.9a.9.9 0 0 0-1-1.3a9.8 9.8 0 1 0 12.9 12.9a.9.9 0 0 0-1.3-1a8.2 8.2 0 0 1-1.6.7Z"
      />
    </svg>
  );
}

function SystemCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frameId;
    let canvasVisible = true;
    let latestPoints = [];
    let draggedNode = null;
    let dragOffset = { x: 0, y: 0 };
    let hoveredNodeIndex = -1;
    let pulseStartedAt = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      active: false,
      opacity: 0,
    };

    const nodes = [
      { label: "Python", x: 0.1, y: 0.22, color: "#136f63" },
      { label: "FastAPI", x: 0.25, y: 0.16, color: "#3569a8" },
      { label: "React", x: 0.43, y: 0.2, color: "#d25b44" },
      { label: "Postgres", x: 0.6, y: 0.27, color: "#c99020" },
      { label: "Airflow", x: 0.78, y: 0.16, color: "#d25b44" },
      { label: "AWS", x: 0.9, y: 0.38, color: "#136f63" },
      { label: "Bedrock", x: 0.77, y: 0.56, color: "#3569a8" },
      { label: "Spark", x: 0.62, y: 0.73, color: "#3569a8" },
      { label: "Kafka", x: 0.45, y: 0.8, color: "#c99020" },
      { label: "Redis", x: 0.28, y: 0.7, color: "#d25b44" },
      { label: "RBAC", x: 0.14, y: 0.56, color: "#d25b44" },
      { label: "Docker", x: 0.34, y: 0.43, color: "#136f63" },
      { label: "K8s", x: 0.52, y: 0.48, color: "#3569a8" },
      { label: "RabbitMQ", x: 0.68, y: 0.42, color: "#c99020" },
      { label: "Terraform", x: 0.86, y: 0.76, color: "#136f63" },
    ];

    function getPointerPosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function findNodeAt(position) {
      return [...latestPoints].reverse().find((point) => {
        const chipWidth = Math.max(96, point.label.length * 10 + 28);
        return (
          position.x >= point.px - chipWidth / 2 &&
          position.x <= point.px + chipWidth / 2 &&
          position.y >= point.py - 20 &&
          position.y <= point.py + 20
        );
      });
    }

    function setCanvasCursor(position) {
      if (draggedNode) {
        canvas.style.cursor = "grabbing";
        return;
      }
      canvas.style.cursor = findNodeAt(position) ? "grab" : "default";
    }

    function onPointerDown(event) {
      const position = getPointerPosition(event);
      const point = findNodeAt(position);

      if (!point) {
        return;
      }

      draggedNode = nodes[point.index];
      dragOffset = {
        x: position.x - point.px,
        y: position.y - point.py,
      };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
      event.preventDefault();
    }

    function onPointerMove(event) {
      const position = getPointerPosition(event);
      const supportsPointerField = event.pointerType === "mouse" || event.pointerType === "pen";

      if (supportsPointerField && !reduceMotion) {
        pointer.targetX = position.x;
        pointer.targetY = position.y;
        if (!pointer.active) {
          pointer.x = position.x;
          pointer.y = position.y;
        }
        pointer.active = true;

        const nextHoveredNode = findNodeAt(position)?.index ?? -1;
        if (nextHoveredNode !== hoveredNodeIndex) {
          hoveredNodeIndex = nextHoveredNode;
          if (hoveredNodeIndex >= 0) {
            pulseStartedAt = performance.now();
          }
        }
      }

      if (!draggedNode) {
        setCanvasCursor(position);
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const nextX = (position.x - dragOffset.x) / width;
      const nextY = (position.y - dragOffset.y) / height;
      draggedNode.x = Math.min(0.94, Math.max(0.06, nextX));
      draggedNode.y = Math.min(0.88, Math.max(0.12, nextY));
      event.preventDefault();
    }

    function onPointerEnter(event) {
      if ((event.pointerType === "mouse" || event.pointerType === "pen") && !reduceMotion) {
        const position = getPointerPosition(event);
        pointer.x = position.x;
        pointer.y = position.y;
        pointer.targetX = position.x;
        pointer.targetY = position.y;
        pointer.active = true;
      }
    }

    function onPointerLeave(event) {
      stopDragging(event);
      pointer.active = false;
      hoveredNodeIndex = -1;
    }

    function stopDragging(event) {
      if (draggedNode && event?.pointerId != null && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      draggedNode = null;
      canvas.style.cursor = "default";
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function roundedRect(x, y, width, height, radius) {
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, width, height, radius);
        return;
      }
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    function draw(time = 0) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dark ? "#0f172a" : "#f7f8f5";
      ctx.fillRect(0, 0, width, height);

      pointer.x += (pointer.targetX - pointer.x) * 0.16;
      pointer.y += (pointer.targetY - pointer.y) * 0.16;
      pointer.opacity += ((pointer.active ? 1 : 0) - pointer.opacity) * 0.12;

      for (let x = 0; x < width; x += 42) {
        ctx.strokeStyle = dark ? "rgba(45, 212, 191, 0.1)" : "rgba(19, 111, 99, 0.08)";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += 42) {
        ctx.strokeStyle = dark ? "rgba(45, 212, 191, 0.1)" : "rgba(19, 111, 99, 0.08)";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (pointer.opacity > 0.01 && !reduceMotion) {
        const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 150);
        halo.addColorStop(0, dark ? `rgba(45, 212, 191, ${0.14 * pointer.opacity})` : `rgba(19, 111, 99, ${0.11 * pointer.opacity})`);
        halo.addColorStop(0.45, dark ? `rgba(53, 105, 168, ${0.07 * pointer.opacity})` : `rgba(53, 105, 168, ${0.045 * pointer.opacity})`);
        halo.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      const points = nodes.map((node, index) => {
        const basePoint = {
          x: node.x * width,
          y: node.y * height + (draggedNode === node || reduceMotion ? 0 : Math.sin(time / 900 + index) * 8),
        };
        const influence = draggedNode === node || reduceMotion || pointer.opacity < 0.01
          ? { offsetX: 0, offsetY: 0, intensity: 0 }
          : getPointerInfluence(basePoint, pointer);

        return {
          ...node,
          index,
          px: basePoint.x + influence.offsetX * pointer.opacity,
          py: basePoint.y + influence.offsetY * pointer.opacity,
          pointerIntensity: influence.intensity * pointer.opacity,
        };
      });
      latestPoints = points;

      points.forEach((point, index) => {
        const next = points[(index + 1) % points.length];
        const connectionGlow = Math.max(point.pointerIntensity, next.pointerIntensity);
        const baseAlpha = 0.18 + connectionGlow * 0.38;
        ctx.strokeStyle = dark
          ? `rgba(226, 232, 240, ${baseAlpha})`
          : `rgba(23, 32, 29, ${baseAlpha})`;
        ctx.lineWidth = 1.5 + connectionGlow * 1.4;
        ctx.beginPath();
        ctx.moveTo(point.px, point.py);
        ctx.lineTo(next.px, next.py);
        ctx.stroke();

        const progress = reduceMotion ? 0.5 : (Math.sin(time / 700 + index) + 1) / 2;
        ctx.fillStyle = point.color;
        ctx.beginPath();
        ctx.arc(point.px + (next.px - point.px) * progress, point.py + (next.py - point.py) * progress, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (hoveredNodeIndex >= 0 && !reduceMotion) {
        const hoveredPoint = points[hoveredNodeIndex];
        const pulseProgress = Math.min((time - pulseStartedAt) / 850, 1);
        const pulseOpacity = Math.max(0, 1 - pulseProgress) * pointer.opacity;

        if (hoveredPoint && pulseOpacity > 0) {
          ctx.strokeStyle = hoveredPoint.color;
          ctx.globalAlpha = pulseOpacity * 0.55;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(hoveredPoint.px, hoveredPoint.py, 26 + pulseProgress * 32, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      points.forEach((point) => {
        const chipWidth = Math.max(96, point.label.length * 10 + 28);
        ctx.fillStyle = dark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.86)";
        ctx.strokeStyle = point.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        roundedRect(point.px - chipWidth / 2, point.py - 20, chipWidth, 40, 7);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = dark ? "#f8fafc" : "#17201d";
        ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(point.label, point.px, point.py + 1);
      });

      if (canvasVisible) frameId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === canvasVisible) return;
      canvasVisible = entry.isIntersecting;
      if (canvasVisible) draw(performance.now());
      else cancelAnimationFrame(frameId);
    });
    visibilityObserver.observe(canvas);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", stopDragging);
    canvas.addEventListener("pointercancel", stopDragging);
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", stopDragging);
      canvas.removeEventListener("pointercancel", stopDragging);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas absolute inset-0 h-full w-full opacity-55" aria-hidden="true" />;
}

function App() {
  const [mode, setMode] = useState("all");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [flowIndex, setFlowIndex] = useState(0);
  const prepareProjectTransition = usePortfolioMotion(mode);
  const activeFlow = flowSteps[flowIndex];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const filteredProjects = useMemo(() => projects.filter((project) => visible(project, mode)), [mode]);
  const filteredSkills = skills;

  return (
    <div className="page-grid min-h-screen bg-paper text-ink transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <div className="reading-progress fixed inset-x-0 top-0 z-50 h-0.5 bg-moss dark:bg-teal-300" />
      <header className="site-header sticky top-0 z-40 border-b border-ink/10 bg-paper/90 px-5 py-4 text-ink backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 dark:text-white lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3 font-extrabold" aria-label="Nesar Bhaskar Ganguli home">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-ink font-mono text-sm text-white dark:bg-white dark:text-slate-950">
              NBG
            </span>
            <span
              className="nav-name-motion hidden lg:inline-block"
            >
              Nesar Bhaskar Ganguli
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-4">
            <nav className="flex gap-4 text-sm font-bold text-slate-600 dark:text-slate-300 sm:gap-6" aria-label="Primary navigation">
              <a href="#experience" className="hover:text-ink dark:hover:text-white">Experience</a>
              <a href="#projects" className="hover:text-ink dark:hover:text-white">Projects</a>
              <a href="#systems" className="hover:text-ink dark:hover:text-white">Systems</a>
              <a href="#contact" className="hover:text-ink dark:hover:text-white">Contact</a>
            </nav>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative inline-flex h-8 w-14 items-center rounded-full border border-ink/20 bg-white p-1 text-ink transition dark:border-white/20 dark:bg-slate-800 dark:text-white"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full bg-ink text-white transition-transform dark:bg-white dark:text-slate-950 ${
                  theme === "dark" ? "translate-x-6" : "translate-x-0"
                }`}
              >
                <ThemeIcon theme={theme} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-scene relative border-b border-ink/10 dark:border-white/10">
          <div className="hero-stage">
          <SystemCanvas />
          <div className="hero-side-fade hero-side-fade-left" aria-hidden="true" />
          <div className="hero-side-fade hero-side-fade-right" aria-hidden="true" />
          <div className="hero-content pointer-events-none relative z-10 mx-auto max-w-7xl">
            <h1
              className="hero-name hero-name-scroll text-center font-extrabold leading-none tracking-normal"
            >
              <span className="hero-line-mask"><span className="hero-name-line">Nesar Bhaskar</span></span>{" "}
              <span className="hero-line-mask"><span className="hero-name-line">Ganguli</span></span>
            </h1>
            <div
              className="hero-summary pointer-events-none absolute inset-x-5 mx-auto max-w-5xl text-center"
            >
              <p className="font-mono text-sm font-extrabold uppercase tracking-normal text-moss dark:text-teal-200 sm:text-base">
                Backend, AI, and Data Systems Engineer
              </p>
              <h2 className="mx-auto mt-4 max-w-4xl text-2xl font-extrabold leading-tight tracking-normal text-ink dark:text-white sm:text-4xl lg:text-5xl">
                I build <span className="summary-emphasis emphasis-backend">secure backend platforms<span className="emphasis-line" aria-hidden="true" /></span>, <span className="summary-emphasis emphasis-ai">AI workflows<span className="emphasis-line" aria-hidden="true" /></span>, and <span className="summary-emphasis emphasis-data">data pipelines<span className="emphasis-line" aria-hidden="true" /></span> that scale.
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200 sm:text-base sm:leading-7">
                My work spans FastAPI, Flask, React, PostgreSQL, AWS, Bedrock, Airflow, Kubernetes, Spark, Redis, and event-driven systems.
              </p>
            </div>
            <div className="hero-scroll-cue"><span>Bloomington, IN</span><ArrowDown size={18} /><span>Software / AI / Data</span></div>
          </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl overflow-hidden px-5 py-16 lg:px-12">
          <div data-reveal className="apple-reveal mb-8">
            <p className="eyebrow">Metrics</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-normal sm:text-5xl">
              Measurable engineering outcomes.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(([value, copy], index) => (
              <article
                key={value}
                data-reveal
                data-reveal-delay={`${index * 90}ms`}
                className={`metric-reveal metric-reveal-${index < 2 ? "left" : "right"} metric-item p-6`}
              >
                <span className="block font-mono text-3xl font-extrabold text-coral">{value}</span>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" data-reveal className="apple-reveal mx-auto max-w-7xl px-5 py-16 lg:px-12 lg:py-24">
          <SectionHeading eyebrow="Experience" title="Built in production." />
          <div className="experience-timeline relative">
            <span className="timeline-progress" aria-hidden="true" />
            {experiences.map((experience, index) => (
              <div
                key={experience.title}
                data-reveal
                data-reveal-delay={`${index * 80}ms`}
                className={`timeline-item apple-reveal ${index % 2 === 0 ? "timeline-item-left" : "timeline-item-right"}`}
              >
                <span className="timeline-dot" aria-hidden="true" />
                <article className="motion-card rounded-lg border border-l-4 border-ink/10 border-l-moss bg-white p-7 dark:border-white/10 dark:border-l-teal-400 dark:bg-slate-900">
                  <span className="eyebrow">{experience.date}</span>
                  <h3 className="mt-3 text-2xl font-extrabold">{experience.title}</h3>
                  <p className="mt-3 leading-8 text-slate-600 dark:text-slate-300">{experience.copy}</p>
                  <ul className="mt-5 grid gap-3 pl-5 leading-7 text-slate-800 dark:text-slate-100">
                    {experience.bullets.map((bullet) => (
                      <li key={bullet} className="list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" data-reveal className="apple-reveal mx-auto max-w-7xl px-5 py-16 lg:px-12 lg:py-24">
          <SectionHeading eyebrow="Selected Projects" title="Ideas turned into working systems." />
          <div className="project-filters mb-8 flex flex-wrap gap-3" aria-label="Project filters">
            <span className="filter-indicator" aria-hidden="true" />
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={mode === item.id}
                onClick={() => { if (mode !== item.id) { prepareProjectTransition(); setMode(item.id); } }}
                className={`h-11 rounded-md border px-5 font-extrabold transition hover:-translate-y-0.5 hover:shadow-soft ${
                  mode === item.id
                    ? "border-ink bg-ink text-white dark:border-teal-300 dark:bg-teal-300 dark:text-slate-950"
                    : "border-ink/25 bg-white/80 text-ink dark:border-white/20 dark:bg-slate-900/80 dark:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="project-grid grid gap-5 lg:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <article
                key={project.title}
                data-flip-id={project.title}
                data-reveal
                data-reveal-delay={`${index * 75}ms`}
                className={`project-card apple-reveal motion-card overflow-hidden rounded-lg border border-ink/10 bg-white dark:border-white/10 dark:bg-slate-900 ${project.title === "ClipDial" ? "project-featured" : ""}`}
              >
                <ProjectVisual project={project} index={index} />
                <div className="p-7">
                  <p className="eyebrow">{project.type}</p>
                  <h3 className="text-2xl font-extrabold">{project.title}</h3>
                  <p className="mt-3 leading-8 text-slate-600 dark:text-slate-300">{project.copy}</p>
                  <details className="project-details mt-5">
                    <summary>Engineering details <ArrowDown size={16} /></summary>
                  <ul className="mt-5 grid gap-3 pl-5 leading-7 text-slate-800 dark:text-slate-100">
                    {project.bullets.map((bullet) => (
                      <li key={bullet} className="list-disc">{bullet}</li>
                    ))}
                  </ul>
                  </details>
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noreferrer"
                      className="motion-link mt-6 inline-flex h-11 items-center gap-2 rounded-md border border-ink/20 px-4 font-extrabold transition hover:bg-ink hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-slate-950"
                      aria-label={`Open website for ${project.title}`}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          fill="currentColor"
                          d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm6.9 9h-3.1a15 15 0 0 0-1.2-5A8.1 8.1 0 0 1 18.9 11ZM12 4.1c.8 1.1 1.5 3.6 1.7 6.9h-3.4c.2-3.3.9-5.8 1.7-6.9ZM4.1 13h3.1a15 15 0 0 0 1.2 5A8.1 8.1 0 0 1 4.1 13Zm3.1-2H4.1A8.1 8.1 0 0 1 8.4 6a15 15 0 0 0-1.2 5ZM12 19.9c-.8-1.1-1.5-3.6-1.7-6.9h3.4c-.2 3.3-.9 5.8-1.7 6.9Zm2.6-1.9a15 15 0 0 0 1.2-5h3.1a8.1 8.1 0 0 1-4.3 5Z"
                        />
                      </svg>
                      Website
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                    className="motion-link mt-6 inline-flex h-11 items-center gap-2 rounded-md border border-ink/20 px-4 font-extrabold transition hover:bg-ink hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-slate-950"
                      aria-label={`Open GitHub repositories for ${project.title}`}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          fill="currentColor"
                          d="M12 .8a11.2 11.2 0 0 0-3.5 21.8c.6.1.8-.2.8-.6v-2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1.6 2.8 4 2 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2.1V22c0 .4.2.7.8.6A11.2 11.2 0 0 0 12 .8Z"
                        />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="systems" data-reveal className="apple-reveal mx-auto max-w-7xl px-5 py-16 lg:px-12 lg:py-24">
          <SectionHeading eyebrow="How I Build Systems" title="From input to impact." />
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="grid gap-4 rounded-lg border border-ink/10 bg-white bg-grid p-5 dark:border-white/10 dark:bg-slate-900">
              {flowSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  aria-pressed={flowIndex === index}
                  onClick={() => setFlowIndex(index)}
                  className={`min-h-14 rounded-md border p-4 text-left font-extrabold transition hover:-translate-y-0.5 hover:shadow-soft ${
                    flowIndex === index
                      ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-ink/20 bg-white/80 dark:border-white/15 dark:bg-slate-950/60"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
            <div key={activeFlow.title} className="flow-step-content min-h-80 rounded-lg border border-ink/10 bg-white p-7 dark:border-white/10 dark:bg-slate-900">
              <span className="eyebrow">Current Step</span>
              <h3 className="mt-4 text-2xl font-extrabold">{activeFlow.title}</h3>
              <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{activeFlow.copy}</p>
            </div>
          </div>
        </section>

        <section data-reveal className="apple-reveal mx-auto max-w-7xl px-5 py-16 lg:px-12 lg:py-24">
          <SectionHeading eyebrow="Toolbelt" title="The tools behind the work." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {filteredSkills.map((skill, index) => (
              <article
                key={skill.title}
                data-reveal
                data-reveal-delay={`${index * 70}ms`}
                className="apple-reveal motion-card rounded-lg border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
              >
                <h3 className="text-xl font-extrabold">{skill.title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{skill.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" data-reveal className="contact-grid apple-reveal grid gap-8 bg-ink px-5 py-20 text-white dark:bg-black lg:grid-cols-[1fr_0.85fr] lg:px-12">
          <div className="mx-auto w-full max-w-7xl lg:col-span-2 lg:grid lg:grid-cols-[1fr_0.85fr] lg:gap-8">
            <div className="contact-copy">
              <p className="eyebrow text-teal-300">Contact</p>
              <h2 className="max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl">
                Let’s build systems that can be trusted when the data gets messy.
              </h2>
            </div>
            <div className="contact-links mt-8 flex flex-wrap content-start gap-3 lg:mt-0 lg:justify-end">
              {[
                ["nesarbhaskarganguli@gmail.com", "mailto:nesarbhaskarganguli@gmail.com"],
                ["LinkedIn", "https://www.linkedin.com/in/nesarganguli/"],
                ["GitHub", "https://github.com/nesar-ganguli"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center rounded-md border border-white/25 px-4 font-extrabold transition hover:bg-white hover:text-ink"
                >
                  {label}<ArrowUpRight size={16} className="ml-2 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </section>
        <footer className="portfolio-footer"><span>Nesar Bhaskar Ganguli</span><a href="#top" aria-label="Back to top">Back to top <ArrowUpRight size={16} /></a></footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
