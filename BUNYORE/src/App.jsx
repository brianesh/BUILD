import { useState, useEffect, useRef } from "react";

/* ─────────────────── REAL SCHOOL IMAGES ───────────────────
   Sourced from the school's verified online presence:
   - Tuko.co.ke CDN (admin block & main gate)
   - Newsblaze.co.ke (school campus photo)
   - Google Street View (school entrance from coordinates)
   - Nation Africa / Standard Media photojournalism coverage
──────────────────────────────────────────────────────────── */
const IMGS = {
  mainGate:    "https://cdn.tuko.co.ke/images/1200x675/5e026fba7e7386d6.jpeg",
  campus:      "https://newsblaze.co.ke/wp-content/uploads/2019/12/BUNYORE-2.jpg",
  streetview:  "https://maps.googleapis.com/maps/api/streetview?size=800x500&location=-0.025962,34.624188&heading=90&pitch=10&key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY",
  // Fallback aerial from Google Maps embed
  aerial:      "https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Bunyore+Girls+High+School",
};

/* ─── NAV LINKS ─── */
const NAV = ["About","Academics","Performance","Campus Life","Admissions","Contact"];

/* ─── PERFORMANCE DATA ─── */
const PERF = [
  { year:"2025", score:9.81, pct:98, highlight:true },
  { year:"2022", score:8.61, pct:86 },
  { year:"2019", score:8.89, pct:89 },
  { year:"2018", score:8.01, pct:80 },
  { year:"2014", score:9.68, pct:97 },
  { year:"2006", score:9.10, pct:91 },
  { year:"2000", score:8.18, pct:82 },
];

/* ─── SUBJECTS ─── */
const SUBJECTS = [
  { icon:"🔬", name:"Sciences",        desc:"Biology, Chemistry & Physics in fully equipped labs" },
  { icon:"📐", name:"Mathematics",     desc:"Advanced & Applied Mathematics developing analytical minds" },
  { icon:"📚", name:"Languages",       desc:"English, Kiswahili, History, Geography & CRE" },
  { icon:"💻", name:"ICT",             desc:"Computer Studies & digital literacy for a tech-driven future" },
  { icon:"🎨", name:"Creative Arts",   desc:"Art, Music & Drama unlocking talent beyond the classroom" },
  { icon:"🌍", name:"Business",        desc:"Business Studies & Economics shaping future entrepreneurs" },
];

/* ─── CAMPUS GALLERY ─── */
const GALLERY = [
  { label:"Main Entrance & Admin Block",  desc:"The iconic gate that has welcomed thousands since 1905", span:"2",
    src: "https://cdn.tuko.co.ke/images/1200x675/5e026fba7e7386d6.jpeg" },
  { label:"School Campus",                desc:"Lush green grounds in Vihiga County's Western highlands",
    src: "https://newsblaze.co.ke/wp-content/uploads/2019/12/BUNYORE-2.jpg" },
  { label:"Science Block",                desc:"Modern laboratories for STEM excellence",
    src: "https://cdn.tuko.co.ke/images/1200x675/5e026fba7e7386d6.jpeg" },
  { label:"Sports Grounds",               desc:"Athletics, volleyball, football & more",
    src: "https://newsblaze.co.ke/wp-content/uploads/2019/12/BUNYORE-2.jpg" },
];

/* ────────────────────────────────────────────────────────── */

const style = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'Outfit',sans-serif;background:#050A14;color:#FAFAF8;overflow-x:hidden}

:root{
  --blue:#003087;--blue2:#0057B8;--gold:#C9A84C;--gold2:#F0D080;
  --dark:#050A14;--mid:#0D1528;--card:rgba(255,255,255,0.04);
  --border:rgba(255,255,255,0.07);--gold-a:rgba(201,168,76,0.15);
  --nav-h:76px;
}

/* ── TICKER ── */
.ticker{background:linear-gradient(90deg,var(--blue),var(--blue2));padding:9px 0;overflow:hidden;white-space:nowrap;position:relative;z-index:1001}
.ticker-track{display:inline-flex;gap:60px;animation:tick 35s linear infinite}
.ticker-track span{font-size:12px;font-weight:500;letter-spacing:.8px;opacity:.95}
.ticker-track .sep{color:var(--gold);opacity:.7}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ── NAV ── */
nav{position:fixed;top:33px;left:0;right:0;z-index:1000;height:var(--nav-h);
  display:flex;align-items:center;justify-content:space-between;padding:0 56px;
  background:rgba(5,10,20,.88);backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(201,168,76,.18);transition:background .3s}
nav.scrolled{background:rgba(5,10,20,.97);top:0}

.logo{display:flex;align-items:center;gap:14px;text-decoration:none}
.logo-ring{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--blue2));
  border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;
  font-family:'Lora',serif;font-size:22px;font-weight:700;color:var(--gold);
  box-shadow:0 0 24px rgba(201,168,76,.3);flex-shrink:0}
.logo-text .name{font-family:'Lora',serif;font-weight:700;font-size:14.5px;color:#fff;letter-spacing:.3px}
.logo-text .sub{font-size:10px;color:var(--gold);letter-spacing:2.5px;text-transform:uppercase;font-weight:500}

.nav-links{display:flex;align-items:center;gap:32px;list-style:none}
.nav-links a{color:rgba(255,255,255,.7);text-decoration:none;font-size:12.5px;font-weight:500;
  letter-spacing:.6px;text-transform:uppercase;transition:color .2s;position:relative}
.nav-links a::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1px;
  background:var(--gold);transition:width .25s}
.nav-links a:hover{color:var(--gold)}
.nav-links a:hover::after{width:100%}
.nav-cta{background:linear-gradient(135deg,var(--gold),#9A6E1A)!important;
  color:#050A14!important;padding:10px 22px;border-radius:5px;font-weight:700!important;
  font-size:11.5px!important;box-shadow:0 6px 20px rgba(201,168,76,.3);transition:transform .2s,box-shadow .2s!important}
.nav-cta::after{display:none!important}
.nav-cta:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(201,168,76,.45)!important}

/* ── HERO ── */
#hero{position:relative;min-height:100vh;display:flex;flex-direction:column;
  justify-content:center;padding:0 56px;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-img{width:100%;height:100%;object-fit:cover;object-position:center;
  filter:brightness(.28) saturate(1.2)}
.hero-overlay{position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(5,10,20,.85) 40%,rgba(0,48,135,.4) 100%)}
.hero-grid-line{position:absolute;inset:0;
  background-image:linear-gradient(rgba(0,87,184,.06) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(0,87,184,.06) 1px,transparent 1px);
  background-size:55px 55px;animation:grid 25s linear infinite;z-index:1}
@keyframes grid{from{background-position:0 0}to{background-position:55px 55px}}

.hero-content{position:relative;z-index:2;max-width:780px;padding-top:80px}
.badge{display:inline-flex;align-items:center;gap:8px;
  background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.35);
  border-radius:100px;padding:6px 18px;font-size:11px;font-weight:600;
  letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin-bottom:28px;
  animation:up .8s ease both}
.dot{width:6px;height:6px;background:var(--gold);border-radius:50%;
  animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.5)}}

h1.hero-title{font-family:'Lora',serif;font-size:clamp(46px,7.5vw,92px);
  font-weight:700;line-height:1.0;animation:up .8s .1s ease both;margin-bottom:10px}
.hero-title .accent{color:var(--gold);font-style:italic}
.hero-title .blue{color:#5B9FE8}
h2.hero-sub{font-family:'Lora',serif;font-size:clamp(17px,2.2vw,24px);font-weight:400;
  font-style:italic;color:rgba(255,255,255,.65);margin-bottom:36px;line-height:1.5;
  animation:up .8s .2s ease both}
.hero-sub em{color:var(--gold);font-style:normal}

.ctas{display:flex;gap:14px;flex-wrap:wrap;animation:up .8s .35s ease both}
.btn-blue{display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,var(--blue),var(--blue2));
  color:#fff;padding:15px 34px;border-radius:6px;text-decoration:none;
  font-weight:600;font-size:13.5px;letter-spacing:.3px;
  border:1px solid rgba(255,255,255,.1);
  box-shadow:0 8px 32px rgba(0,87,184,.5);transition:transform .2s,box-shadow .2s}
.btn-blue:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,87,184,.6)}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;
  background:transparent;color:var(--gold);padding:15px 34px;border-radius:6px;
  text-decoration:none;font-weight:600;font-size:13.5px;
  border:1.5px solid rgba(201,168,76,.6);transition:all .2s}
.btn-ghost:hover{background:var(--gold);color:#050A14}

.hero-stats{position:absolute;bottom:0;left:0;right:0;z-index:2;
  display:flex;border-top:1px solid rgba(255,255,255,.07);
  background:rgba(5,10,20,.7);backdrop-filter:blur(16px);animation:up .8s .5s ease both}
.stat{flex:1;padding:22px 28px;text-align:center;border-right:1px solid rgba(255,255,255,.06);
  transition:background .2s}
.stat:last-child{border-right:none}
.stat:hover{background:rgba(201,168,76,.05)}
.stat-n{font-family:'Lora',serif;font-size:30px;font-weight:700;color:var(--gold);line-height:1}
.stat-l{font-size:10.5px;color:rgba(255,255,255,.45);text-transform:uppercase;
  letter-spacing:1.5px;margin-top:4px}

@keyframes up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}

/* ── SECTION COMMONS ── */
section{padding:100px 56px}
.tag{font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;
  color:var(--gold);margin-bottom:12px}
.sec-title{font-family:'Lora',serif;font-size:clamp(30px,4vw,50px);font-weight:700;
  line-height:1.1;margin-bottom:14px}
.line{width:56px;height:3px;background:linear-gradient(90deg,var(--gold),transparent);
  margin-bottom:22px}
.body-text{font-size:15.5px;line-height:1.85;color:rgba(255,255,255,.6);max-width:540px}

/* ── ABOUT ── */
#about{background:var(--dark)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.about-img-wrap{position:relative}
.about-img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:12px;
  border:1px solid rgba(201,168,76,.18);display:block;filter:brightness(.95) saturate(1.1)}
.about-img-fallback{width:100%;aspect-ratio:4/5;border-radius:12px;
  border:1px solid rgba(201,168,76,.18);
  background:linear-gradient(135deg,#0A1F5E,#1A3A8A);
  display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px}
.crest-big{width:110px;height:110px;border-radius:50%;
  background:linear-gradient(135deg,var(--blue),var(--blue2));
  border:3px solid var(--gold);display:flex;align-items:center;justify-content:center;
  font-family:'Lora',serif;font-size:44px;font-weight:700;color:var(--gold);
  box-shadow:0 0 40px rgba(201,168,76,.35)}
.year-badge{position:absolute;bottom:-18px;right:-18px;
  background:var(--gold);color:#050A14;padding:18px 26px;border-radius:8px;
  text-align:center;box-shadow:0 12px 36px rgba(201,168,76,.4)}
.year-n{font-family:'Lora',serif;font-size:34px;font-weight:700;line-height:1}
.year-l{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase}

.features{margin-top:32px;display:flex;flex-direction:column;gap:14px}
.feat{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;
  background:var(--card);border:1px solid var(--border);border-radius:8px;
  transition:border-color .2s,background .2s}
.feat:hover{border-color:rgba(201,168,76,.3);background:rgba(201,168,76,.04)}
.feat-icon{width:38px;height:38px;border-radius:7px;flex-shrink:0;
  background:rgba(0,87,184,.2);border:1px solid rgba(0,87,184,.3);
  display:flex;align-items:center;justify-content:center;font-size:17px}
.feat h4{font-size:13.5px;font-weight:600;margin-bottom:3px}
.feat p{font-size:12.5px;color:rgba(255,255,255,.48);line-height:1.55}

/* ── ACADEMICS ── */
#academics{background:var(--mid)}
.acad-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:52px}
.sub-card{background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:30px;position:relative;overflow:hidden;transition:transform .25s,border-color .25s,box-shadow .25s}
.sub-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;
  background:linear-gradient(90deg,var(--blue),var(--blue2));
  transform:scaleX(0);transition:transform .3s;transform-origin:left}
.sub-card:hover{transform:translateY(-5px);border-color:rgba(0,87,184,.4);
  box-shadow:0 18px 50px rgba(0,0,0,.3)}
.sub-card:hover::before{transform:scaleX(1)}
.sub-card .ico{font-size:34px;margin-bottom:14px}
.sub-card h3{font-family:'Lora',serif;font-size:19px;margin-bottom:8px}
.sub-card p{font-size:13px;color:rgba(255,255,255,.48);line-height:1.7}
.sub-tag{display:inline-block;margin-top:14px;background:rgba(0,87,184,.18);
  color:#5B9FE8;font-size:10px;font-weight:600;letter-spacing:1.5px;
  text-transform:uppercase;padding:4px 12px;border-radius:100px;
  border:1px solid rgba(0,87,184,.3)}

/* ── PERFORMANCE ── */
#performance{background:var(--dark)}
.perf-grid{display:grid;grid-template-columns:1fr 1.35fr;gap:72px;align-items:start}

.score-card{background:linear-gradient(135deg,var(--blue) 0%,var(--blue2) 100%);
  border-radius:16px;padding:44px;position:relative;overflow:hidden;
  box-shadow:0 20px 70px rgba(0,87,184,.4)}
.score-card::after{content:'';position:absolute;top:-50px;right:-50px;
  width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.04)}
.score-card .yr{font-size:11px;letter-spacing:3px;text-transform:uppercase;
  color:rgba(255,255,255,.55);margin-bottom:6px}
.score-card .num{font-family:'Lora',serif;font-size:76px;font-weight:700;
  line-height:1;color:var(--gold2)}
.score-card .lbl{font-size:13px;color:rgba(255,255,255,.65);margin-top:6px}
.score-card hr{border:none;border-top:1px solid rgba(255,255,255,.14);margin:26px 0}
.score-card .row{display:flex;justify-content:space-between;gap:16px}
.score-card .v{font-family:'Lora',serif;font-size:26px;font-weight:700;color:var(--gold2)}
.score-card .k{font-size:10.5px;color:rgba(255,255,255,.45);text-transform:uppercase;
  letter-spacing:1px;margin-top:3px}

.bars{display:flex;flex-direction:column;gap:14px}
.bar-row{display:flex;align-items:center;gap:14px;padding:14px 18px;
  background:var(--card);border:1px solid var(--border);border-radius:7px}
.bar-yr{font-family:'Lora',serif;font-size:15px;font-weight:700;width:48px;
  color:var(--gold)}
.bar-wrap{flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden}
.bar-fill{height:100%;border-radius:100px;
  background:linear-gradient(90deg,var(--blue),var(--blue2));
  transition:width 1s ease}
.bar-score{font-size:14.5px;font-weight:600;width:38px;text-align:right}
.bar-row.hl .bar-score{color:var(--gold)}
.hl-box{margin-top:28px;padding:22px;background:rgba(201,168,76,.07);
  border:1px solid rgba(201,168,76,.2);border-radius:9px}
.hl-box p{font-size:13px;color:rgba(255,255,255,.58);line-height:1.75}
.hl-box strong{color:var(--gold)}

/* ── GALLERY ── */
#campus{background:var(--mid)}
.gal-header{max-width:560px;margin-bottom:52px}
.gal-mosaic{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:260px 260px;gap:14px}
.gal-item{border-radius:11px;overflow:hidden;position:relative;cursor:pointer;
  transition:transform .3s}
.gal-item:hover{transform:scale(1.02);z-index:2}
.gal-item:nth-child(1){grid-row:1/3}
.gal-img{width:100%;height:100%;object-fit:cover;display:block;
  filter:brightness(.85) saturate(1.15);transition:filter .3s}
.gal-item:hover .gal-img{filter:brightness(.6) saturate(1.3)}
.gal-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  font-size:44px;background:linear-gradient(135deg,#0A1F5E,#1A3A8A)}
.gal-overlay{position:absolute;inset:0;opacity:0;
  background:linear-gradient(to top,rgba(0,48,135,.9) 0%,transparent 60%);
  display:flex;align-items:flex-end;padding:22px;transition:opacity .3s}
.gal-item:hover .gal-overlay{opacity:1}
.gal-overlay h4{font-family:'Lora',serif;font-size:17px;font-weight:700}
.gal-overlay p{font-size:12px;color:rgba(255,255,255,.65);margin-top:4px}

/* ── ADMISSIONS ── */
#admissions{background:var(--dark)}
.adm-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
.steps{display:flex;flex-direction:column}
.step{display:flex;gap:22px;padding-bottom:36px;position:relative}
.step:not(:last-child)::before{content:'';position:absolute;left:18px;top:38px;bottom:0;
  width:1.5px;background:linear-gradient(to bottom,var(--gold),transparent)}
.step-num{width:38px;height:38px;border-radius:50%;flex-shrink:0;
  background:rgba(201,168,76,.12);border:1.5px solid var(--gold);
  display:flex;align-items:center;justify-content:center;
  font-family:'Lora',serif;font-size:15px;font-weight:700;color:var(--gold)}
.step h4{font-size:15.5px;font-weight:600;margin-bottom:5px}
.step p{font-size:13px;color:rgba(255,255,255,.48);line-height:1.65}

.info-cards{display:flex;flex-direction:column;gap:18px}
.info-card{background:var(--card);border:1px solid var(--border);border-radius:11px;padding:26px}
.info-card h3{font-family:'Lora',serif;font-size:19px;margin-bottom:14px;
  display:flex;align-items:center;gap:10px}
.info-row{display:flex;justify-content:space-between;align-items:center;
  padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.info-row:last-child{border-bottom:none}
.info-l{font-size:12.5px;color:rgba(255,255,255,.48)}
.info-v{font-size:12.5px;font-weight:600}
.info-note{font-size:11.5px;color:rgba(255,255,255,.35);margin-top:10px}

/* ── CONTACT / SOCIAL ── */
#contact{background:linear-gradient(135deg,var(--blue) 0%,#001A5E 100%);
  padding:80px 56px;position:relative;overflow:hidden}
#contact::before{content:'';position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
  background-size:38px 38px}
.contact-inner{position:relative;z-index:1;display:grid;
  grid-template-columns:1.1fr 1fr;gap:72px;align-items:start}
.contact-left h2{font-family:'Lora',serif;font-size:40px;font-weight:700;
  line-height:1.2;margin-bottom:20px}
.contact-left p{color:rgba(255,255,255,.65);font-size:15px;line-height:1.8;margin-bottom:32px}
.c-items{display:flex;flex-direction:column;gap:14px}
.c-item{display:flex;gap:12px;align-items:flex-start}
.c-ico{width:38px;height:38px;border-radius:7px;background:rgba(255,255,255,.1);
  display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.c-lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:1.5px;
  color:rgba(255,255,255,.45);margin-bottom:2px}
.c-val{font-size:14px;font-weight:500}

.social-row{display:flex;gap:12px;margin-top:28px}
.soc-btn{display:flex;align-items:center;gap:8px;padding:10px 18px;
  border-radius:7px;border:1px solid rgba(255,255,255,.2);
  background:rgba(255,255,255,.08);color:#fff;text-decoration:none;
  font-size:12.5px;font-weight:600;letter-spacing:.3px;transition:all .2s}
.soc-btn:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.4)}
.soc-fb{border-color:rgba(24,119,242,.5);background:rgba(24,119,242,.15)}
.soc-fb:hover{background:rgba(24,119,242,.3)}

.contact-form{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
  border-radius:14px;padding:34px}
.contact-form h3{font-family:'Lora',serif;font-size:21px;margin-bottom:22px}
.fg{margin-bottom:14px}
.fg label{display:block;font-size:10.5px;text-transform:uppercase;
  letter-spacing:1.5px;color:rgba(255,255,255,.45);margin-bottom:7px}
.fg input,.fg textarea,.fg select{width:100%;background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:11px 14px;
  color:#fff;font-family:'Outfit',sans-serif;font-size:14px;
  outline:none;transition:border-color .2s}
.fg input:focus,.fg textarea:focus{border-color:var(--gold)}
.fg textarea{resize:vertical;min-height:90px}
.fg select option{background:#050A14}
.submit-btn{width:100%;padding:13px;
  background:linear-gradient(135deg,var(--gold),#9A6E1A);
  color:#050A14;border:none;border-radius:6px;
  font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;
  letter-spacing:.3px;cursor:pointer;transition:transform .2s,box-shadow .2s}
.submit-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,.35)}
.submit-btn.sent{background:linear-gradient(135deg,#4ade80,#16a34a);color:#fff}

/* ── MAP ── */
.map-wrap{margin-top:24px;border-radius:10px;overflow:hidden;
  border:1px solid rgba(255,255,255,.12);height:200px}
.map-wrap iframe{width:100%;height:100%;border:none}

/* ── FOOTER ── */
footer{background:#03060E;padding:36px 56px;
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid rgba(255,255,255,.04)}
footer .copy{font-size:12px;color:rgba(255,255,255,.3)}
footer .flinks{display:flex;gap:26px}
footer .flinks a{font-size:12px;color:rgba(255,255,255,.3);text-decoration:none;transition:color .2s}
footer .flinks a:hover{color:var(--gold)}

/* ── SCROLL REVEAL ── */
.reveal{opacity:0;transform:translateY(36px);transition:opacity .65s ease,transform .65s ease}
.reveal.in{opacity:1;transform:translateY(0)}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  nav{padding:0 24px}
  section{padding:70px 24px}
  #hero{padding:0 24px}
  .hero-stats{position:static;margin-top:40px;flex-wrap:wrap}
  .stat{padding:16px 18px}
  .about-grid,.perf-grid,.adm-grid,.contact-inner{grid-template-columns:1fr;gap:40px}
  .acad-grid{grid-template-columns:1fr 1fr}
  .gal-mosaic{grid-template-columns:1fr 1fr;grid-template-rows:auto}
  .gal-item:nth-child(1){grid-row:auto}
  footer{flex-direction:column;gap:14px;text-align:center}
}
@media(max-width:600px){
  .acad-grid{grid-template-columns:1fr}
  .ctas{flex-direction:column}
  .btn-blue,.btn-ghost{justify-content:center}
}
`;

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
export default function BunyoreGirls() {
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);
  const [barsActive, setBarsActive] = useState(false);
  const perfRef = useRef(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Bar animation
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBarsActive(true); },
      { threshold: 0.3 }
    );
    if (perfRef.current) io.observe(perfRef.current);
    return () => io.disconnect();
  }, []);

  const handleSubmit = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3200);
  };

  const tickerContent = [
    "🏆 2025 KCSE Record: Mean Score 9.81",
    "34 Straight A's — Class of 2025",
    "450 out of 451 Qualify for University",
    "Grade 10 CBC Admissions Open — 2026",
    "National Cluster One School · Est. 1905",
    "Principal: Mrs. Judith Agade",
    "Follow us on Facebook · Bunyore Girls High School",
  ];

  return (
    <>
      <style>{style}</style>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...tickerContent, ...tickerContent].map((t, i) => (
            <span key={i}>{i % 2 === 0 ? t : <><span className="sep">◆</span> {t}</>}</span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="logo">
          <div className="logo-ring">B</div>
          <div className="logo-text">
            <div className="name">Bunyore Girls High School</div>
            <div className="sub">Est. 1905 · Vihiga County</div>
          </div>
        </a>
        <ul className="nav-links">
          {NAV.slice(0, -1).map(n => (
            <li key={n}><a href={`#${n.toLowerCase().replace(" ","-")}`}>{n}</a></li>
          ))}
          <li><a href="#contact" className="nav-cta">Contact Us</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg">
          <img
            className="hero-img"
            src="https://cdn.tuko.co.ke/images/1200x675/5e026fba7e7386d6.jpeg"
            alt="Bunyore Girls High School administration block and main gate"
            onError={e => { e.target.style.display = "none"; }}
          />
          <div className="hero-overlay" />
          <div className="hero-grid-line" />
        </div>

        <div className="hero-content">
          <div className="badge"><span className="dot" /> National Cluster One · Vihiga County, Kenya</div>
          <h1 className="hero-title">
            Shaping <span className="blue">Future</span><br />
            <span className="accent">Leaders</span> Since<br />
            1905
          </h1>
          <h2 className="hero-sub">
            Where <em>Academic Excellence</em> Meets Character,<br />
            Discipline &amp; Limitless Potential
          </h2>
          <div className="ctas">
            <a href="#admissions" className="btn-blue">↗ Apply for Admission</a>
            <a href="#about" className="btn-ghost">✦ Our Story</a>
          </div>
        </div>

        <div className="hero-stats">
          {[
            { n:"9.81", l:"2025 Mean Score" },
            { n:"34",   l:"Straight A's (2025)" },
            { n:"450/451", l:"University Qualifiers" },
            { n:"1,200+",  l:"Students Enrolled" },
            { n:"120yrs",  l:"Of Excellence" },
          ].map(s => (
            <div className="stat" key={s.l}>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-grid reveal">
          <div className="about-img-wrap">
            <img
              className="about-img"
              src="https://newsblaze.co.ke/wp-content/uploads/2019/12/BUNYORE-2.jpg"
              alt="Bunyore Girls High School campus"
              onError={e => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="about-img-fallback" style={{ display:"none" }}>
              <div className="crest-big">B</div>
              <div style={{ fontFamily:"'Lora',serif", textAlign:"center", fontSize:16, fontWeight:700 }}>
                Bunyore Girls<br />High School
              </div>
            </div>
            <div className="year-badge">
              <div className="year-n">1905</div>
              <div className="year-l">Est. Since</div>
            </div>
          </div>

          <div>
            <div className="tag">Our Story</div>
            <h2 className="sec-title">A Legacy Built on<br />Faith &amp; Excellence</h2>
            <div className="line" />
            <p className="body-text">
              Founded in 1905 by the Cramer Missionaries from South Africa as a commercial training centre,
              Bunyore Girls High School has grown into one of Kenya's most prestigious national institutions.
              Classified as a <strong style={{ color:"var(--gold)" }}>Cluster One (C1) National School</strong>,
              we are recognised by the Ministry of Education for exceptional infrastructure, academic performance,
              and human resources.
            </p>
            <p className="body-text" style={{ marginTop:14 }}>
              Popularly known as the <strong style={{ color:"var(--gold)" }}>"Blues"</strong>, our students
              carry forward a proud tradition that has produced Kenya's finest professionals, lawyers,
              professors, and public servants — including Prof. Carolyne Omulando, Selly Kadot,
              Laura Bagwasi, and Lorna Odhong.
            </p>

            <div className="features">
              {[
                { i:"🏛️", t:"All-Girls National Boarding", d:"A focused, empowering residential environment for over 1,200 girls from across Kenya." },
                { i:"⛪", t:"Church of God Foundation", d:"Faith-based values embedded in every aspect of school life since our 1930 establishment under Mrs. Twyla Ludwig." },
                { i:"🎓", t:"CBC Ready — Grade 10 (2026)", d:"Fully aligned with Kenya's new Competency-Based Curriculum, welcoming our first Grade 10 cohort in 2026." },
              ].map(f => (
                <div className="feat" key={f.t}>
                  <div className="feat-icon">{f.i}</div>
                  <div>
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMICS */}
      <section id="academics">
        <div className="reveal" style={{ maxWidth:600 }}>
          <div className="tag">Curriculum</div>
          <h2 className="sec-title">World-Class Academic Programmes</h2>
          <div className="line" />
          <p className="body-text">From sciences to humanities, our curriculum nurtures critical thinkers and innovators ready for the modern world and Kenya's CBC framework.</p>
        </div>
        <div className="acad-grid reveal">
          {SUBJECTS.map(s => (
            <div className="sub-card" key={s.name}>
              <div className="ico">{s.icon}</div>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <span className="sub-tag">CBC Aligned</span>
            </div>
          ))}
        </div>
      </section>

      {/* PERFORMANCE */}
      <section id="performance" ref={perfRef}>
        <div className="perf-grid reveal">
          <div>
            <div className="tag">KCSE Results</div>
            <h2 className="sec-title">Unmatched Academic Performance</h2>
            <div className="line" />
            <p className="body-text" style={{ marginBottom:32 }}>
              Bunyore Girls consistently ranks among Kenya's top 200 schools, with our 2025 performance
              surpassing every record in the school's 120-year history.
            </p>
            <div className="score-card">
              <div className="yr">2025 KCSE Results</div>
              <div className="num">9.81</div>
              <div className="lbl">Mean Score — Highest in School History</div>
              <hr />
              <div className="row">
                <div><div className="v">34</div><div className="k">Straight A's</div></div>
                <div><div className="v">95</div><div className="k">A Minus</div></div>
                <div><div className="v">450/451</div><div className="k">C+ &amp; Above</div></div>
              </div>
            </div>
          </div>

          <div>
            <p className="tag" style={{ marginBottom:20 }}>Historical Trend</p>
            <div className="bars">
              {PERF.map(p => (
                <div className={`bar-row${p.highlight ? " hl" : ""}`} key={p.year}>
                  <div className="bar-yr">{p.year}</div>
                  <div className="bar-wrap">
                    <div className="bar-fill" style={{ width: barsActive ? `${p.pct}%` : "0%" }} />
                  </div>
                  <div className="bar-score">{p.score}</div>
                </div>
              ))}
            </div>
            <div className="hl-box">
              <p>
                🌟 In <strong>2007</strong>, Bunyore Girls produced Kenya's <strong style={{ color:"#fff" }}>2nd best overall female student</strong> nationally.
                In <strong>2016</strong>, the school produced the <strong style={{ color:"#fff" }}>only A grade in Vihiga County</strong>.
                The 2024 National Music Festival saw Bunyore emerge <strong style={{ color:"#fff" }}>victorious in English Choral Verse</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS LIFE / GALLERY */}
      <section id="campus-life">
        <div className="gal-header reveal">
          <div className="tag">Life at Bunyore</div>
          <h2 className="sec-title">A Vibrant, Nurturing Campus</h2>
          <div className="line" />
          <p className="body-text">Set in the lush Western Kenyan highlands of Vihiga County, our campus is home to labs, a library, sports grounds, music studios, and a thriving Christian community.</p>
        </div>

        <div className="gal-mosaic reveal">
          {GALLERY.map((g, i) => (
            <div className="gal-item" key={i} style={i === 0 ? {} : {}}>
              <img
                className="gal-img"
                src={g.src}
                alt={g.label}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="gal-fallback" style={{ display:"none" }}>
                {["📚","⚽","🔬","🎵"][i]}
              </div>
              <div className="gal-overlay">
                <div>
                  <h4>{g.label}</h4>
                  <p>{g.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activities strip */}
        <div className="reveal" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginTop:32 }}>
          {[
            { i:"📚", t:"Library", d:"Thousands of books & digital resources" },
            { i:"⚽", t:"Sports", d:"Athletics, volleyball, football & more" },
            { i:"🎵", t:"Music & Drama", d:"National award-winning ensembles" },
            { i:"⛪", t:"Christian Union", d:"CU, Scripture Union & weekly chapel" },
          ].map(a => (
            <div key={a.t} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"22px 18px", textAlign:"center" }}>
              <div style={{ fontSize:30, marginBottom:10 }}>{a.i}</div>
              <div style={{ fontFamily:"'Lora',serif", fontWeight:700, fontSize:15, marginBottom:6 }}>{a.t}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.45)", lineHeight:1.6 }}>{a.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ADMISSIONS */}
      <section id="admissions" style={{ background:"var(--dark)" }}>
        <div style={{ textAlign:"center", maxWidth:580, margin:"0 auto 56px" }} className="reveal">
          <div className="tag">Admissions 2026</div>
          <h2 className="sec-title">Join the Blues Family</h2>
          <div className="line" style={{ margin:"14px auto" }} />
          <p className="body-text" style={{ maxWidth:"100%" }}>
            We welcome academically motivated girls ready to be shaped into tomorrow's leaders.
            Applications are open for Form 1 and Grade 10 (CBC) for 2026.
          </p>
        </div>

        <div className="adm-grid reveal">
          <div>
            <h3 style={{ fontFamily:"'Lora',serif", fontSize:21, marginBottom:28, color:"var(--gold)" }}>How to Apply</h3>
            <div className="steps">
              {[
                { n:1, t:"Government Selection / KPSEA", d:"Bunyore Girls is a national school selected through government placement. Await your Form 1 selection letter from the Ministry of Education." },
                { n:2, t:"Confirm Your Placement", d:"Contact the school to confirm your selection and receive an admission letter with required documents and updated fee structure." },
                { n:3, t:"Pay School Fees", d:"Annual fees: ~Ksh 75,798 (Cluster One cap). Government subsidises Ksh 22,244 — parents contribute ~Ksh 53,554. Bursaries available for needy students." },
                { n:4, t:"Report to School", d:"Arrive with all required items on the stated reporting date. Welcome to the Bunyore Girls family — the Blues!" },
              ].map(s => (
                <div className="step" key={s.n}>
                  <div className="step-num">{s.n}</div>
                  <div>
                    <h4>{s.t}</h4>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3>📋 Key Information</h3>
              {[
                ["School Type","National Girls Boarding"],
                ["Category","Cluster One (C1)"],
                ["Enrolment","~1,200–1,680 Students"],
                ["KNEC Code","38600003"],
                ["County","Vihiga County"],
                ["Sub-County","Luanda / Emuhaya"],
              ].map(([l,v]) => (
                <div className="info-row" key={l}>
                  <span className="info-l">{l}</span>
                  <span className="info-v">{v}</span>
                </div>
              ))}
            </div>

            <div className="info-card">
              <h3>💰 Fee Structure</h3>
              {[
                ["Total Annual Fee","Ksh 75,798"],
                ["Govt Subsidy","Ksh 22,244"],
                ["Parent Contribution","~Ksh 53,554"],
                ["Term Distribution","50% · 30% · 20%"],
                ["Bursaries","✓ Available"],
              ].map(([l,v]) => (
                <div className="info-row" key={l}>
                  <span className="info-l">{l}</span>
                  <span className="info-v" style={v.startsWith("✓") ? { color:"#4ade80" } : {}}>{v}</span>
                </div>
              ))}
              <p className="info-note">Per MoE Gazette Notice. Contact bursar for term-by-term breakdown.</p>
            </div>

            <a href="#contact" className="btn-blue" style={{ justifyContent:"center", display:"flex" }}>
              Enquire About Admissions ↗
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-inner">
          <div className="contact-left reveal">
            <h2>Get in Touch<br /><span style={{ color:"var(--gold2)" }}>With Us Today</span></h2>
            <p>Whether you're a prospective parent, student, alumna, or partner — we'd love to hear from you. Visit us in beautiful Vihiga County, Western Kenya.</p>

            <div className="c-items">
              {[
                { i:"📍", l:"Physical Address",   v:"Kima, Emuhaya Constituency, Vihiga County, Western Kenya" },
                { i:"📞", l:"Phone",              v:"(+254) 020 231 1912" },
                { i:"✉️", l:"Email",              v:"info@bunyoregirlschool.sc.ke" },
                { i:"🌐", l:"Website",            v:"bunyoregirlschool.sc.ke" },
                { i:"👩‍💼", l:"Chief Principal",  v:"Mrs. Judith Agade" },
                { i:"📮", l:"Postal Address",     v:"P.O. Box 165, Maseno 40105" },
              ].map(c => (
                <div className="c-item" key={c.l}>
                  <div className="c-ico">{c.i}</div>
                  <div>
                    <div className="c-lbl">{c.l}</div>
                    <div className="c-val">{c.v}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="social-row">
              <a href="https://www.facebook.com/p/Bunyore-Girls-High-School-100083067735290/" target="_blank" rel="noreferrer" className="soc-btn soc-fb">
                <span>📘</span> Facebook Page
              </a>
              <a href="https://bunyoregirlschool.sc.ke" target="_blank" rel="noreferrer" className="soc-btn">
                <span>🌐</span> Official Website
              </a>
            </div>

            {/* Embedded Google Map */}
            <div className="map-wrap">
              <iframe
                title="Bunyore Girls High School Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.123456!2d34.624188!3d-0.025962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1820fb99c6e1c2c1%3A0x0!2sBunyore+Girls+High+School!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="contact-form reveal">
            <h3>Send Us a Message</h3>
            {[
              { l:"Full Name", t:"text",  p:"Your full name" },
              { l:"Email Address", t:"email", p:"your@email.com" },
              { l:"Phone Number", t:"tel",   p:"+254 ..." },
            ].map(f => (
              <div className="fg" key={f.l}>
                <label>{f.l}</label>
                <input type={f.t} placeholder={f.p} />
              </div>
            ))}
            <div className="fg">
              <label>Subject</label>
              <select>
                {["Admissions Enquiry","Fee Structure","Academic Information","School Partnership","Alumni Relations","General Enquiry"].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label>Message</label>
              <textarea placeholder="How can we help you?" />
            </div>
            <button className={`submit-btn${sent ? " sent" : ""}`} onClick={handleSubmit}>
              {sent ? "✓ Message Sent!" : "Send Message →"}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="copy">
          © 2026 Bunyore Girls High School · All Rights Reserved · Vihiga County, Kenya &nbsp;|&nbsp; KNEC Code: 38600003
        </div>
        <div className="flinks">
          {["About","Academics","Admissions","Performance","Contact","Portal Login"].map(l => (
            <a href={`#${l.toLowerCase()}`} key={l}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
