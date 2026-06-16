import { useState, useEffect, useRef } from "react";
import { X, Instagram, Mail, ExternalLink, ChevronDown, Send, ShoppingBag, Archive, User, Sun, Moon, Menu } from "lucide-react";
import { client, urlFor } from "./sanityClient.jsx";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  dark: {
    bg:"#000",bg2:"#050505",bg3:"#0a0a0a",bg4:"#111",
    border:"#1a1a1a",border2:"#222",
    text:"#fff",muted:"#888",dim:"#555",dimmer:"#444",dimmest:"#333",
    tag:"#444",inputBg:"#0d0d0d",btnBg:"#fff",btnText:"#000",
    navBg:"rgba(0,0,0,0.94)",
  },
  light: {
    bg:"#f5f4f0",bg2:"#eeecea",bg3:"#fff",bg4:"#e8e6e2",
    border:"#dddbd6",border2:"#ccc",
    text:"#0a0a0a",muted:"#444",dim:"#666",dimmer:"#888",dimmest:"#999",
    tag:"#888",inputBg:"#fff",btnBg:"#0a0a0a",btnText:"#fff",
    navBg:"rgba(245,244,240,0.94)",
  }
};

const SOCIALS = [
  { label:"Instagram", href:"https://www.instagram.com/unicali_/",                                                        Icon:Instagram   },
  { label:"Threads",   href:"https://www.threads.com/@unicali_?xmt=AQG0Qb1SqbxO36aa28bsGZ-rYf5whJK3SqpA8PZuUUgBEbw",    Icon:ExternalLink },
  { label:"Email",     href:"mailto:unicali.kontakt@gmail.com",                                                            Icon:Mail        },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
const useInView = (threshold = 0.08) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
};

// ─── SANITY QUERIES ───────────────────────────────────────────────────────────
const ARTWORK_QUERY = `*[_type == "artwork"] | order(_createdAt desc) {
  _id, title, medium, year, size, price, description, aspect, tags,
  image { asset->{ _id, url } }
}`;

const WALL_QUERY = `*[_type == "wall"] | order(_createdAt desc) {
  _id, title, location, year, description,
  image { asset->{ _id, url } }
}`;

// ─── IMAGE COMPONENT ──────────────────────────────────────────────────────────
const SanityImage = ({ image, alt, style }) => {
  if (!image?.asset) return null;
  return <img src={urlFor(image).width(1200).auto('format').url()} alt={alt||""} style={{width:"100%",height:"100%",objectFit:"cover",...style}}/>;
};

// ─── PLACEHOLDER (gdy brak zdjęcia) ──────────────────────────────────────────
const Placeholder = ({ id, t, height, ratio }) => (
  <div style={{width:"100%",height:height,aspectRatio:ratio,background:t.bg4,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
    <svg viewBox="0 0 100 100" style={{width:56,height:56,opacity:0.13}} stroke={t.text} fill="none" strokeWidth="2">
      <circle cx="50" cy="50" r="42" strokeDasharray="4 6"/>
      <path d="M25 65 L40 45 L55 58 L65 48 L80 65 Z"/><circle cx="38" cy="35" r="6"/>
    </svg>
    <span style={{position:"absolute",bottom:6,right:8,fontSize:9,color:t.dimmest,letterSpacing:"0.1em"}}>No image</span>
  </div>
);

const ArtImage = ({ art, t, aspect }) => {
  const h = aspect==="tall"?260:aspect==="wide"?150:190;
  if (art.image?.asset) return (
    <div style={{width:"100%",height:h,overflow:"hidden",flexShrink:0}}>
      <SanityImage image={art.image} alt={art.title} style={{height:h}}/>
    </div>
  );
  return <Placeholder id={art._id} t={t} height={h}/>;
};

// ─── LOADING SPINNER ──────────────────────────────────────────────────────────
const Spinner = ({ t }) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"4rem",width:"100%"}}>
    <div style={{width:32,height:32,border:`2px solid ${t.border2}`,borderTopColor:t.text,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ art, onClose, t }) => {
  const [form, setForm] = useState({name:"",email:"",message:""});
  const [sent, setSent] = useState(false);
  const isMobile = useIsMobile();
  if (!art) return null;
  const inp = {background:t.inputBg,border:`1px solid ${t.border2}`,color:t.text,padding:"11px 12px",borderRadius:2,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,overflowY:"auto",WebkitOverflowScrolling:"touch",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:isMobile?"0":"2rem 1rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:t.bg3,border:`1px solid ${t.border}`,borderRadius:isMobile?0:4,maxWidth:760,width:"100%",padding:isMobile?"1.25rem":"2rem",position:"relative",marginTop:isMobile?0:"2rem",marginBottom:isMobile?0:"2rem",minHeight:isMobile?"100dvh":"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:t.bg4,border:`1px solid ${t.border}`,borderRadius:2,cursor:"pointer",color:t.muted,padding:6,display:"flex",alignItems:"center",zIndex:2}}><X size={18}/></button>
        {art.image?.asset ? (
          <div style={{width:"100%",height:isMobile?200:280,overflow:"hidden",borderRadius:2}}>
            <SanityImage image={art.image} alt={art.title} style={{height:isMobile?200:280}}/>
          </div>
        ) : <Placeholder id={art._id} t={t} height={isMobile?200:280}/>}
        <div style={{marginTop:"1.25rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
            <h2 style={{fontSize:isMobile?20:26,fontWeight:900,letterSpacing:"-0.02em",color:t.text,margin:0,textTransform:"uppercase"}}>{art.title}</h2>
            {art.price && <span style={{fontSize:18,fontWeight:700,color:t.text}}>{art.price}</span>}
          </div>
          <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
            {[art.medium,art.year,art.size].filter(Boolean).map(v=>(
              <span key={v} style={{fontSize:10,letterSpacing:"0.1em",color:t.dim,textTransform:"uppercase"}}>{v}</span>
            ))}
          </div>
          <p style={{marginTop:"0.75rem",color:t.muted,lineHeight:1.7,fontSize:14}}>{art.description}</p>
          {art.price && (
            <button style={{display:"flex",alignItems:"center",gap:8,marginTop:"1rem",padding:"11px 20px",background:t.btnBg,color:t.btnText,border:"none",borderRadius:2,fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",width:isMobile?"100%":"auto",justifyContent:isMobile?"center":"flex-start"}}>
              <ShoppingBag size={14}/> Add to Cart
            </button>
          )}
        </div>
        <div style={{borderTop:`1px solid ${t.border}`,marginTop:"1.25rem",paddingTop:"1.25rem"}}>
          <h3 style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:t.dim,marginBottom:"1rem",fontWeight:600}}>Inquire About This Work</h3>
          {sent ? <p style={{color:t.muted,fontSize:14}}>✓ Message sent.</p> : (
            <div style={{display:"grid",gap:10}}>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10}}>
                <input placeholder="Name"  value={form.name}  onChange={e=>setForm(p=>({...p,name:e.target.value}))}  style={inp}/>
                <input placeholder="Email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={inp}/>
              </div>
              <textarea placeholder="Your message…" rows={3} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{...inp,resize:"vertical"}}/>
              <button onClick={()=>{if(form.name&&form.email)setSent(true)}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px 24px",background:t.btnBg,color:t.btnText,border:"none",borderRadius:2,fontSize:12,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",width:isMobile?"100%":"auto"}}>
                <Send size={13}/> Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ART CARD ─────────────────────────────────────────────────────────────────
const ArtCard = ({ art, onOpen, index, t }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{breakInside:"avoid",marginBottom:12,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:`opacity 0.5s ${(index%3)*70}ms ease,transform 0.5s ${(index%3)*70}ms ease`,background:t.bg3,border:`1px solid ${t.border}`,borderRadius:2,overflow:"hidden"}}>
      <ArtImage art={art} t={t} aspect={art.aspect||"square"}/>
      <div style={{padding:"0.875rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
          <h3 style={{fontSize:14,fontWeight:800,letterSpacing:"-0.01em",color:t.text,margin:0,textTransform:"uppercase"}}>{art.title}</h3>
          <span style={{fontSize:10,color:t.dimmest,flexShrink:0,marginLeft:8}}>{art.year}</span>
        </div>
        <p style={{fontSize:10,color:t.dim,letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 10px"}}>{art.medium}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {(art.tags||[]).map(tag=><span key={tag} style={{fontSize:9,color:t.tag,border:`1px solid ${t.border}`,padding:"2px 6px",borderRadius:1,letterSpacing:"0.06em",textTransform:"uppercase"}}>{tag}</span>)}
          </div>
          <button onClick={()=>onOpen(art)} style={{fontSize:10,color:t.muted,background:"none",border:`1px solid ${t.border2}`,padding:"5px 10px",borderRadius:1,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap",flexShrink:0}}>View →</button>
        </div>
      </div>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = ({ t, isDark, toggleTheme, page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scroll = id => {
    if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({behavior:"smooth"}), 80); }
    else document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setMenuOpen(false);
  };
  const navLinks = [
    {label:"gallery", action:()=>scroll("gallery")},
    {label:"walls",   action:()=>{setPage("walls");setMenuOpen(false);}},
    {label:"archives",action:()=>scroll("archives")},
    {label:"about",   action:()=>scroll("about")},
    {label:"contact", action:()=>scroll("contact")},
  ];
  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:500,transition:"background 0.35s",background:scrolled||menuOpen?t.navBg:"transparent",backdropFilter:scrolled||menuOpen?"blur(12px)":"none",borderBottom:`1px solid ${scrolled||menuOpen?t.border:"transparent"}`,padding:isMobile?"0.875rem 1.25rem":"1rem 2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:900,letterSpacing:"0.2em",color:t.text,textTransform:"uppercase",padding:0}}>UniCali</button>
        <div style={{display:"flex",alignItems:"center",gap:isMobile?10:20}}>
          {!isMobile && navLinks.map(({label,action})=>(
            <button key={label} onClick={action} style={{background:"none",border:"none",color:page==="walls"&&label==="walls"?t.text:t.dim,fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",padding:"4px 0",borderBottom:page==="walls"&&label==="walls"?`1px solid ${t.text}`:"1px solid transparent",transition:"color 0.25s"}}
              onMouseEnter={e=>e.currentTarget.style.color=t.text}
              onMouseLeave={e=>e.currentTarget.style.color=page==="walls"&&label==="walls"?t.text:t.dim}>{label}</button>
          ))}
          <button onClick={toggleTheme} style={{display:"flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:2,background:"none",border:`1px solid ${t.border2}`,cursor:"pointer",color:t.muted}}>
            {isDark ? <Sun size={14}/> : <Moon size={14}/>}
          </button>
          {isMobile && (
            <button onClick={()=>setMenuOpen(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:2,background:"none",border:`1px solid ${t.border2}`,cursor:"pointer",color:t.muted}}>
              {menuOpen ? <X size={16}/> : <Menu size={16}/>}
            </button>
          )}
        </div>
      </nav>
      {isMobile && menuOpen && (
        <div style={{position:"fixed",inset:0,zIndex:499,background:t.navBg,backdropFilter:"blur(16px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
          {navLinks.map(({label,action})=>(
            <button key={label} onClick={action} style={{background:"none",border:"none",color:t.text,fontSize:"clamp(1.5rem,6vw,2rem)",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 2rem",width:"100%",textAlign:"center"}}>{label}</button>
          ))}
        </div>
      )}
    </>
  );
};

// ─── WALLS PAGE ───────────────────────────────────────────────────────────────
const WallsPage = ({ t, walls, loading }) => {
  const isMobile = useIsMobile();
  useEffect(() => { window.scrollTo(0,0); }, []);
  return (
    <div style={{paddingTop:isMobile?"60px":"70px",background:t.bg,minHeight:"100dvh",transition:"background 0.4s"}}>
      <div style={{padding:isMobile?"2.5rem 1.25rem 1.5rem":"4rem 2rem 2rem",maxWidth:1200,margin:"0 auto"}}>
        <p style={{fontSize:10,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 8px"}}>Street Art</p>
        <h1 style={{fontSize:"clamp(2.5rem,8vw,6rem)",fontWeight:900,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"-0.03em",lineHeight:0.9}}>Walls</h1>
        <p style={{marginTop:"1.25rem",fontSize:13,color:t.dim,maxWidth:480,lineHeight:1.7}}>Zbiór murali, throwupów i prac na ścianach. Ulica jako galeria — beton jako płótno.</p>
        <div style={{width:40,height:1,background:t.border2,margin:"1.5rem 0"}}/>
        <p style={{fontSize:11,color:t.dimmest,letterSpacing:"0.12em",textTransform:"uppercase"}}>{walls.length} walls</p>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:isMobile?"0 0 4rem":"0 2rem 6rem"}}>
        {loading ? <Spinner t={t}/> : walls.length === 0 ? (
          <p style={{color:t.dim,padding:"2rem",fontSize:13,textAlign:"center"}}>Brak prac. Dodaj pierwszą w panelu Sanity.</p>
        ) : walls.map((wall,i) => <WallItem key={wall._id} wall={wall} t={t} isMobile={isMobile} index={i}/>)}
      </div>
    </div>
  );
};

const WallItem = ({ wall, t, isMobile, index }) => {
  const [ref, visible] = useInView(0.05);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(30px)",transition:`opacity 0.7s ${index*60}ms ease,transform 0.7s ${index*60}ms ease`,marginBottom:isMobile?2:3,position:"relative",overflow:"hidden",cursor:"default"}}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      {wall.image?.asset ? (
        <div style={{width:"100%",aspectRatio:"16/9",overflow:"hidden",position:"relative"}}>
          <img src={urlFor(wall.image).width(1400).auto('format').url()} alt={wall.title} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.6s ease",transform:hovered&&!isMobile?"scale(1.02)":"scale(1)"}}/>
          {!isMobile && (
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",opacity:hovered?1:0,transition:"opacity 0.35s ease",display:"flex",alignItems:"flex-end",padding:"2rem"}}>
              <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,lineHeight:1.7,maxWidth:500,margin:0}}>{wall.description}</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{width:"100%",aspectRatio:"16/9",background:t.bg4,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 100 60" style={{width:"20%",opacity:0.1}} stroke={t.text} fill="none" strokeWidth="1.5"><rect x="2" y="2" width="96" height="56" rx="1" strokeDasharray="3 4"/><path d="M20 45 L35 25 L50 38 L65 28 L80 45 Z"/><circle cx="30" cy="18" r="7"/></svg>
        </div>
      )}
      <div style={{padding:isMobile?"0.875rem 1.25rem":"1rem 0",borderBottom:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"baseline",gap:isMobile?12:20,flexWrap:"wrap"}}>
          <h2 style={{fontSize:isMobile?14:16,fontWeight:900,letterSpacing:"0.05em",color:t.text,margin:0,textTransform:"uppercase"}}>{wall.title}</h2>
          <span style={{fontSize:isMobile?11:12,color:t.dim,letterSpacing:"0.08em",textTransform:"uppercase"}}>{wall.location}</span>
        </div>
        <span style={{fontSize:11,color:t.dimmest,letterSpacing:"0.1em"}}>{wall.year}</span>
      </div>
      {isMobile && wall.description && (
        <p style={{fontSize:12,color:t.dim,lineHeight:1.7,padding:"0.75rem 1.25rem",borderBottom:`1px solid ${t.border}`}}>{wall.description}</p>
      )}
    </div>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onScrollDown, t, setPage }) => {
  const isMobile = useIsMobile();
  return (
    <section style={{minHeight:"100dvh",background:t.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:isMobile?"2rem 1.5rem":"2rem",transition:"background 0.4s"}}>
      <p style={{fontSize:isMobile?10:12,letterSpacing:"0.35em",color:t.dimmer,textTransform:"uppercase",marginBottom:"1.25rem"}}>Calligraphy × Street Art</p>
      <h1 style={{fontSize:"clamp(4rem,18vw,9rem)",fontWeight:900,color:t.text,lineHeight:0.88,letterSpacing:"-0.03em",textTransform:"uppercase",margin:0}}>
        UNI<br/><span style={{WebkitTextStroke:`2px ${t.text}`,color:"transparent"}}>CALI</span>
      </h1>
      <p style={{marginTop:"1rem",fontSize:"clamp(0.7rem,2.5vw,0.9rem)",color:t.dimmer,letterSpacing:"0.25em",textTransform:"uppercase"}}>Litery | Letters</p>
      <div style={{display:"flex",gap:12,marginTop:"2.5rem",flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={onScrollDown} style={{background:"none",border:`1px solid ${t.border2}`,color:t.dim,padding:isMobile?"11px 24px":"12px 32px",borderRadius:2,fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8}}>
          View Work <ChevronDown size={13}/>
        </button>
        <button onClick={()=>setPage("walls")} style={{background:t.btnBg,border:"none",color:t.btnText,padding:isMobile?"11px 24px":"12px 32px",borderRadius:2,fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",fontWeight:700}}>
          Walls →
        </button>
      </div>
    </section>
  );
};

// ─── GALLERY ──────────────────────────────────────────────────────────────────
const Gallery = ({ onOpen, galleryRef, t, artworks, loading }) => {
  const isMobile = useIsMobile();
  return (
    <section ref={galleryRef} id="gallery" style={{background:t.bg,padding:isMobile?"3rem 1rem":"6rem 2rem",transition:"background 0.4s"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:"2rem",display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
          <div>
            <p style={{fontSize:10,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 6px"}}>Selected Works</p>
            <h2 style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:900,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"-0.02em"}}>Gallery</h2>
          </div>
          {!isMobile && <p style={{color:t.dimmer,fontSize:13,maxWidth:260,textAlign:"right",lineHeight:1.6}}>Original works available.</p>}
        </div>
        {loading ? <Spinner t={t}/> : artworks.length === 0 ? (
          <p style={{color:t.dim,fontSize:13,padding:"2rem 0"}}>Brak prac. Dodaj pierwszą w panelu Sanity Studio.</p>
        ) : (
          <div style={{columns:isMobile?"1":"2",columnGap:12}} className="masonry-grid">
            {artworks.map((art,i)=><ArtCard key={art._id} art={art} onOpen={onOpen} index={i} t={t}/>)}
          </div>
        )}
      </div>
    </section>
  );
};

// ─── ARCHIVES ─────────────────────────────────────────────────────────────────
const ArchivesSection = ({ t, artworks }) => {
  const [ref, visible] = useInView();
  const [openYear, setOpenYear] = useState(null);
  const isMobile = useIsMobile();
  const byYear = artworks.reduce((acc, art) => {
    const y = art.year || "Unknown";
    if (!acc[y]) acc[y] = [];
    acc[y].push(art);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a,b) => b-a);
  return (
    <section id="archives" style={{background:t.bg2,borderTop:`1px solid ${t.border}`,padding:isMobile?"3rem 1rem":"6rem 2rem",transition:"background 0.4s"}}>
      <div ref={ref} style={{maxWidth:1100,margin:"0 auto",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>
        <div style={{marginBottom:"2rem"}}>
          <p style={{fontSize:10,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 6px"}}>Past Works</p>
          <h2 style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:900,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"-0.02em"}}>Archives</h2>
        </div>
        {years.length === 0 ? (
          <p style={{color:t.dim,fontSize:13}}>Prace pojawią się tutaj automatycznie po dodaniu ich w Sanity.</p>
        ) : (
          <div style={{display:"grid",gap:2}}>
            {years.map(year=>(
              <div key={year} style={{border:`1px solid ${t.border}`,borderRadius:2,overflow:"hidden"}}>
                <button onClick={()=>setOpenYear(openYear===year?null:year)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:isMobile?"1rem":"1.25rem 1.5rem",background:t.bg3,border:"none",cursor:"pointer",color:t.text}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Archive size={14} color={t.dimmer}/>
                    <span style={{fontSize:isMobile?18:22,fontWeight:900,letterSpacing:"-0.02em",textTransform:"uppercase"}}>{year}</span>
                    <span style={{fontSize:10,color:t.dimmer,letterSpacing:"0.1em",textTransform:"uppercase"}}>{byYear[year].length} works</span>
                  </div>
                  <span style={{color:t.dimmer,fontSize:16,transition:"transform 0.3s",display:"inline-block",transform:openYear===year?"rotate(45deg)":"rotate(0deg)"}}>+</span>
                </button>
                {openYear===year && (
                  <div style={{padding:isMobile?"0.75rem":"1rem 1.5rem 1.5rem",background:t.bg2,display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                    {byYear[year].map(art=>(
                      <div key={art._id} style={{border:`1px solid ${t.border}`,borderRadius:2,padding:"0.875rem",background:t.bg3}}>
                        {art.image?.asset ? (
                          <div style={{width:"100%",height:90,overflow:"hidden",marginBottom:10,borderRadius:1}}>
                            <img src={urlFor(art.image).width(400).auto('format').url()} alt={art.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                          </div>
                        ) : <Placeholder id={art._id} t={t} height={90}/>}
                        <h4 style={{fontSize:12,fontWeight:800,color:t.text,textTransform:"uppercase",margin:"0 0 3px"}}>{art.title}</h4>
                        <p style={{fontSize:10,color:t.dim,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 6px"}}>{art.medium}{art.size?` · ${art.size}`:""}</p>
                        <p style={{fontSize:12,color:t.muted,lineHeight:1.6,margin:"0 0 8px"}}>{art.description}</p>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          {(art.tags||[]).map(tag=><span key={tag} style={{fontSize:9,color:t.tag,border:`1px solid ${t.border}`,padding:"2px 5px",borderRadius:1,letterSpacing:"0.06em",textTransform:"uppercase"}}>{tag}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const AboutSection = ({ t }) => {
  const [ref, visible] = useInView();
  const isMobile = useIsMobile();
  return (
    <section id="about" style={{background:t.bg,borderTop:`1px solid ${t.border}`,padding:isMobile?"3rem 1rem":"6rem 2rem",transition:"background 0.4s"}}>
      <div ref={ref} style={{maxWidth:1100,margin:"0 auto",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>
        <div style={{marginBottom:"2rem"}}>
          <p style={{fontSize:10,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 6px"}}>The Artist</p>
          <h2 style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:900,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"-0.02em"}}>About Me</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?"2rem":"4rem",alignItems:"start"}}>
          <div>
            <div style={{width:"100%",aspectRatio:isMobile?"4/3":"3/4",background:t.bg4,border:`1px solid ${t.border}`,borderRadius:2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,overflow:"hidden"}}>
              <User size={40} color={t.border2}/>
              <p style={{fontSize:10,color:t.dimmest,letterSpacing:"0.15em",textTransform:"uppercase",margin:0}}>Photo placeholder</p>
            </div>
          </div>
          <div style={{paddingTop:isMobile?0:"0.5rem"}}>
            <p style={{fontSize:14,color:t.muted,lineHeight:1.8,marginBottom:"1.25rem"}}>Tu wpisz swój opis. Kim jesteś, skąd pochodzi twój styl, co cię inspiruje.</p>
            <p style={{fontSize:14,color:t.dim,lineHeight:1.8,marginBottom:"1.5rem"}}>Drugi akapit — wystawy, projekty, współprace lub filozofia twórcza.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:"1.5rem"}}>
              {[["Based in","Polska"],["Style","Calligraffiti"],["Medium","Ink & Spray"],["Since","2020"]].map(([k,v])=>(
                <div key={k} style={{borderTop:`1px solid ${t.border}`,paddingTop:10}}>
                  <p style={{fontSize:9,color:t.dimmer,textTransform:"uppercase",letterSpacing:"0.15em",margin:"0 0 3px"}}>{k}</p>
                  <p style={{fontSize:14,fontWeight:700,color:t.text,margin:0,textTransform:"uppercase"}}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = ({ t }) => {
  const [ref, visible] = useInView();
  const [form, setForm] = useState({name:"",email:"",message:""});
  const [sent, setSent] = useState(false);
  const isMobile = useIsMobile();
  const inp = {background:t.inputBg,border:`1px solid ${t.border2}`,color:t.text,padding:"12px 14px",borderRadius:2,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <section id="contact" style={{background:t.bg2,borderTop:`1px solid ${t.border}`,padding:isMobile?"3rem 1rem":"6rem 2rem",transition:"background 0.4s"}}>
      <div ref={ref} style={{maxWidth:680,margin:"0 auto",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>
        <p style={{fontSize:10,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 6px"}}>Get In Touch</p>
        <h2 style={{fontSize:"clamp(1.6rem,5vw,3rem)",fontWeight:900,color:t.text,margin:"0 0 0.5rem",textTransform:"uppercase",letterSpacing:"-0.02em"}}>Contact</h2>
        <p style={{color:t.dim,marginBottom:"2rem",lineHeight:1.7,fontSize:14}}>Commission inquiries, collaborations, exhibition bookings, or just to say hello.</p>
        <div style={{display:"flex",gap:isMobile?12:20,marginBottom:"2.5rem",flexWrap:"wrap"}}>
          {SOCIALS.map(({label,href,Icon})=>(
            <a key={label} href={href} style={{display:"flex",alignItems:"center",gap:7,color:t.dim,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none",padding:"6px 0",borderBottom:"1px solid transparent",transition:"color 0.2s,border-color 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color=t.text;e.currentTarget.style.borderBottomColor=t.border2}}
              onMouseLeave={e=>{e.currentTarget.style.color=t.dim;e.currentTarget.style.borderBottomColor="transparent"}}>
              <Icon size={15}/>{label}
            </a>
          ))}
        </div>
        {sent ? <p style={{color:t.muted,fontSize:14}}>✓ Thank you. I'll respond within 48 hours.</p> : (
          <div style={{display:"grid",gap:10}}>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10}}>
              {["name","email"].map(f=>(
                <input key={f} placeholder={f.charAt(0).toUpperCase()+f.slice(1)} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} style={inp}/>
              ))}
            </div>
            <textarea placeholder="Message" rows={4} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{...inp,resize:"vertical"}}/>
            <button onClick={()=>{if(form.name&&form.email)setSent(true)}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 28px",background:t.btnBg,color:t.btnText,border:"none",borderRadius:2,fontSize:12,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",width:isMobile?"100%":"auto"}}>
              <Send size={13}/> Send Message
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState("home");
  const [artworks, setArtworks] = useState([]);
  const [walls, setWalls] = useState([]);
  const [loadingArt, setLoadingArt] = useState(true);
  const [loadingWalls, setLoadingWalls] = useState(true);
  const galleryRef = useRef(null);
  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    client.fetch(ARTWORK_QUERY).then(data => { setArtworks(data); setLoadingArt(false); }).catch(()=>setLoadingArt(false));
    client.fetch(WALL_QUERY).then(data => { setWalls(data); setLoadingWalls(false); }).catch(()=>setLoadingWalls(false));
  }, []);

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:t.bg,minHeight:"100dvh",color:t.text,transition:"background 0.4s,color 0.4s"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}input::placeholder,textarea::placeholder{color:#999}@media(min-width:640px){.masonry-grid{columns:3!important}}`}</style>
      <Nav t={t} isDark={isDark} toggleTheme={()=>setIsDark(d=>!d)} page={page} setPage={setPage}/>
      {page === "walls" ? (
        <WallsPage t={t} walls={walls} loading={loadingWalls}/>
      ) : (
        <>
          <Hero t={t} setPage={setPage} onScrollDown={()=>galleryRef.current?.scrollIntoView({behavior:"smooth"})}/>
          <Gallery t={t} onOpen={setSelected} galleryRef={galleryRef} artworks={artworks} loading={loadingArt}/>
          <ArchivesSection t={t} artworks={artworks}/>
          <AboutSection t={t}/>
          <Contact t={t}/>
        </>
      )}
      <footer style={{background:t.bg,borderTop:`1px solid ${t.border}`,padding:"1.5rem",textAlign:"center"}}>
        <p style={{fontSize:10,color:t.dimmest,letterSpacing:"0.15em",textTransform:"uppercase",margin:0}}>© 2026 UniCali — All works reserved</p>
      </footer>
      {selected && <Modal art={selected} onClose={()=>setSelected(null)} t={t}/>}
    </div>
  );
}