import { useState, useEffect, useRef } from "react";
import { X, Instagram, Mail, ExternalLink, ChevronDown, Send, ShoppingBag, Archive, User, Sun, Moon } from "lucide-react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  dark: {
    bg:       "#000",
    bg2:      "#050505",
    bg3:      "#0a0a0a",
    bg4:      "#111",
    border:   "#1a1a1a",
    border2:  "#222",
    text:     "#fff",
    muted:    "#888",
    dim:      "#555",
    dimmer:   "#444",
    dimmest:  "#333",
    tag:      "#444",
    tagBg:    "transparent",
    inputBg:  "#0d0d0d",
    btnBg:    "#fff",
    btnText:  "#000",
    navBg:    "rgba(0,0,0,0.92)",
  },
  light: {
    bg:       "#f5f4f0",
    bg2:      "#eeecea",
    bg3:      "#fff",
    bg4:      "#e8e6e2",
    border:   "#dddbd6",
    border2:  "#ccc",
    text:     "#0a0a0a",
    muted:    "#444",
    dim:      "#666",
    dimmer:   "#888",
    dimmest:  "#999",
    tag:      "#888",
    tagBg:    "transparent",
    inputBg:  "#fff",
    btnBg:    "#0a0a0a",
    btnText:  "#fff",
    navBg:    "rgba(245,244,240,0.92)",
  }
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ARTWORKS = [
  { id:1, title:"Void Script I",     medium:"Spray & Ink on Canvas", year:"2024", size:"120×90cm",  price:"$2,400", tags:["calligraphy","monochrome"], description:"A raw collision of traditional Sumi ink brushwork with aggressive aerosol typography. The piece explores the tension between control and chaos, silence and noise.", aspect:"tall"   },
  { id:2, title:"Urban Kanji",        medium:"Mixed Media on Wall",    year:"2023", size:"300×200cm", price:"$8,000", tags:["mural","kanji"],            description:"Commissioned mural fusing kanji characters with classic wildstyle graffiti letterforms. The negative space becomes as important as the mark.",                 aspect:"wide"   },
  { id:3, title:"Threshold",          medium:"Ink on Archival Paper",  year:"2024", size:"60×80cm",  price:"$900",   tags:["calligraphy","abstract"],    description:"A single continuous ink line that traces an invisible city skyline, dissolving into abstract calligraphic strokes at its edges.",                                aspect:"square" },
  { id:4, title:"Concrete Alphabet",  medium:"Spray on Concrete",      year:"2023", size:"180×120cm",price:"$3,200", tags:["street","typography"],       description:"Shot on-location in an abandoned warehouse district. Letters eroded by the environment, becoming part of the urban geological record.",                         aspect:"wide"   },
  { id:5, title:"Breathe",            medium:"Brush & Acrylic",        year:"2024", size:"90×120cm", price:"$1,800", tags:["zen","gesture"],              description:"Gestural strokes informed by Zen ensō practice, scaled up and disrupted by stencilled aerosol bursts. Calm and violence in equilibrium.",                    aspect:"tall"   },
  { id:6, title:"Signal / Noise",     medium:"Ink & Posca on Board",   year:"2022", size:"100×100cm",price:"$2,100", tags:["abstract","monochrome"],     description:"A typographic score — characters arranged like musical notation, oscillating between legibility and pure form.",                                               aspect:"square" },
];

const ARCHIVES = [
  { year:"2022", works:[
    { id:101, title:"First Tag",     medium:"Spray on Wall",   size:"200×150cm", tags:["street","debut"],    description:"The first public piece — raw, unfiltered energy on a Silesian wall." },
    { id:102, title:"Gothic I",      medium:"Ink on Paper",    size:"50×70cm",   tags:["blackletter","ink"], description:"Early blackletter studies, exploring the geometry of gothic scripts." },
    { id:103, title:"Loop",          medium:"Marker on Board", size:"60×60cm",   tags:["abstract","loop"],   description:"Continuous line experiment — one stroke, no lifting the pen." },
  ]},
  { year:"2021", works:[
    { id:104, title:"Roots",         medium:"Brush & Ink",     size:"40×60cm",   tags:["calligraphy","brush"],description:"Exploring the origin of letterforms before they became style." },
    { id:105, title:"Shadow Script", medium:"Spray on Canvas", size:"80×100cm",  tags:["street","shadow"],   description:"Playing with negative space — the shadow of a letter as the letter itself." },
  ]},
  { year:"2020", works:[
    { id:106, title:"Origin",        medium:"Pencil & Ink",    size:"30×40cm",   tags:["sketch","origin"],   description:"The first sketchbook page that started it all." },
  ]},
];

const SOCIALS = [
  { label:"Instagram", href:"https://www.instagram.com/unicali_/",                                                             Icon:Instagram   },
  { label:"Threads",   href:"https://www.threads.com/@unicali_?xmt=AQG0Qb1SqbxO36aa28bsGZ-rYf5whJK3SqpA8PZuUUgBEbw",         Icon:ExternalLink },
  { label:"Email",     href:"mailto:unicali.kontakt@gmail.com",                                                                 Icon:Mail        },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const ArtPlaceholder = ({ id, aspect, t }) => {
  const patterns = [`M10 80 Q50 10 90 80 T170 80`,`M20 20 L80 80 M80 20 L20 80`,`M50 10 L90 90 L10 90 Z`,`M10 50 Q50 5 90 50 Q50 95 10 50`,`M20 50 Q50 20 80 50 Q50 80 20 50`,`M10 10 Q90 50 10 90`];
  const h = aspect==="tall"?280:aspect==="wide"?160:200;
  return (
    <div style={{width:"100%",height:h,background:t.bg4,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <svg viewBox="0 0 100 100" style={{width:70,height:70,opacity:0.18}} stroke={t.text} fill="none" strokeWidth="2">
        <path d={patterns[id%patterns.length]}/><circle cx="50" cy="50" r="42" strokeDasharray="4 6"/>
      </svg>
      <span style={{position:"absolute",bottom:8,right:10,fontSize:10,color:t.dimmest,letterSpacing:"0.1em"}}>IMG {id}</span>
    </div>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ art, onClose, t }) => {
  const [form, setForm] = useState({name:"",email:"",message:""});
  const [sent, setSent] = useState(false);
  if (!art) return null;
  const inp = {background:t.inputBg,border:`1px solid ${t.border2}`,color:t.text,padding:"10px 12px",borderRadius:2,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,overflowY:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"2rem 1rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:t.bg3,border:`1px solid ${t.border}`,borderRadius:4,maxWidth:760,width:"100%",padding:"2rem",position:"relative",marginTop:"2rem",marginBottom:"2rem"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",border:"none",cursor:"pointer",color:t.dim,padding:4}}><X size={22}/></button>
        <ArtPlaceholder id={art.id} aspect="wide" t={t}/>
        <div style={{marginTop:"1.5rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
            <h2 style={{fontSize:26,fontWeight:900,letterSpacing:"-0.02em",color:t.text,margin:0,textTransform:"uppercase"}}>{art.title}</h2>
            {art.price && <span style={{fontSize:20,fontWeight:700,color:t.text}}>{art.price}</span>}
          </div>
          <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
            {[art.medium,art.year,art.size].filter(Boolean).map(v=>(
              <span key={v} style={{fontSize:11,letterSpacing:"0.12em",color:t.dim,textTransform:"uppercase"}}>{v}</span>
            ))}
          </div>
          <p style={{marginTop:"1rem",color:t.muted,lineHeight:1.7,fontSize:15}}>{art.description}</p>
          {art.price && (
            <button style={{display:"flex",alignItems:"center",gap:8,marginTop:"1rem",padding:"10px 20px",background:t.btnBg,color:t.btnText,border:"none",borderRadius:2,fontSize:13,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
              <ShoppingBag size={15}/> Add to Cart
            </button>
          )}
        </div>
        <div style={{borderTop:`1px solid ${t.border}`,marginTop:"1.5rem",paddingTop:"1.5rem"}}>
          <h3 style={{fontSize:12,letterSpacing:"0.15em",textTransform:"uppercase",color:t.dim,marginBottom:"1rem",fontWeight:600}}>Inquire About This Work</h3>
          {sent ? (
            <p style={{color:t.muted,fontSize:14}}>✓ Message sent. I'll be in touch shortly.</p>
          ) : (
            <div style={{display:"grid",gap:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <input placeholder="Name"  value={form.name}  onChange={e=>setForm(p=>({...p,name:e.target.value}))}  style={inp}/>
                <input placeholder="Email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={inp}/>
              </div>
              <textarea placeholder="Your message…" rows={3} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{...inp,resize:"vertical"}}/>
              <button onClick={()=>{if(form.name&&form.email)setSent(true)}} style={{alignSelf:"flex-start",display:"flex",alignItems:"center",gap:8,padding:"10px 24px",background:t.btnBg,color:t.btnText,border:"none",borderRadius:2,fontSize:13,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
                <Send size={14}/> Send
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
  const delay = (index%3)*80;
  return (
    <div ref={ref} style={{breakInside:"avoid",marginBottom:16,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:`opacity 0.55s ${delay}ms ease,transform 0.55s ${delay}ms ease`,background:t.bg3,border:`1px solid ${t.border}`,borderRadius:2,overflow:"hidden"}}>
      <ArtPlaceholder id={art.id} aspect={art.aspect} t={t}/>
      <div style={{padding:"1rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
          <h3 style={{fontSize:15,fontWeight:800,letterSpacing:"-0.01em",color:t.text,margin:0,textTransform:"uppercase"}}>{art.title}</h3>
          <span style={{fontSize:11,color:t.dimmest,letterSpacing:"0.08em"}}>{art.year}</span>
        </div>
        <p style={{fontSize:11,color:t.dim,letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 0 12px"}}>{art.medium}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {art.tags.map(tag=><span key={tag} style={{fontSize:10,color:t.tag,border:`1px solid ${t.border}`,padding:"2px 8px",borderRadius:1,letterSpacing:"0.08em",textTransform:"uppercase"}}>{tag}</span>)}
          </div>
          <button onClick={()=>onOpen(art)} style={{fontSize:11,color:t.muted,background:"none",border:`1px solid ${t.border2}`,padding:"4px 12px",borderRadius:1,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",whiteSpace:"nowrap"}}>View →</button>
        </div>
      </div>
    </div>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onScrollDown, t }) => (
  <section style={{position:"relative",minHeight:"100vh",background:t.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",textAlign:"center",padding:"2rem",transition:"background 0.4s"}}>
    <div style={{position:"relative",zIndex:1}}>
      <p style={{fontSize:12,letterSpacing:"0.35em",color:t.dimmer,textTransform:"uppercase",marginBottom:"1.5rem"}}>Calligraphy × Street Art</p>
      <h1 style={{fontSize:"clamp(3.5rem,10vw,9rem)",fontWeight:900,color:t.text,lineHeight:0.9,letterSpacing:"-0.03em",textTransform:"uppercase",margin:0,transition:"color 0.4s"}}>
        UNI<br/>
        <span style={{WebkitTextStroke:`2px ${t.text}`,color:"transparent"}}>CALI</span>
      </h1>
      <p style={{marginTop:"1rem",fontSize:"clamp(0.75rem,1.5vw,0.95rem)",color:t.dimmer,letterSpacing:"0.25em",textTransform:"uppercase"}}>Litery | Letters</p>
      <button onClick={onScrollDown} style={{marginTop:"3rem",background:"none",border:`1px solid ${t.border2}`,color:t.dim,padding:"12px 32px",borderRadius:2,fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8}}>
        View Work <ChevronDown size={14}/>
      </button>
    </div>
  </section>
);

// ─── GALLERY ──────────────────────────────────────────────────────────────────
const Gallery = ({ onOpen, galleryRef, t }) => (
  <section ref={galleryRef} id="gallery" style={{background:t.bg,padding:"6rem 2rem",transition:"background 0.4s"}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <div style={{marginBottom:"3rem",display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
        <div>
          <p style={{fontSize:11,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 8px"}}>Selected Works</p>
          <h2 style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"-0.02em"}}>Gallery</h2>
        </div>
        <p style={{color:t.dimmer,fontSize:13,maxWidth:280,textAlign:"right",lineHeight:1.6}}>Original works available.</p>
      </div>
      <div style={{columnCount:"var(--cols)",columnGap:16,"--cols":3}} className="masonry-grid">
        {ARTWORKS.map((art,i)=><ArtCard key={art.id} art={art} onOpen={onOpen} index={i} t={t}/>)}
      </div>
    </div>
  </section>
);

// ─── ARCHIVES ─────────────────────────────────────────────────────────────────
const ArchivesSection = ({ t }) => {
  const [ref, visible] = useInView();
  const [openYear, setOpenYear] = useState(null);
  return (
    <section id="archives" style={{background:t.bg2,borderTop:`1px solid ${t.border}`,padding:"6rem 2rem",transition:"background 0.4s"}}>
      <div ref={ref} style={{maxWidth:1100,margin:"0 auto",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>
        <div style={{marginBottom:"3rem"}}>
          <p style={{fontSize:11,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 8px"}}>Past Works</p>
          <h2 style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"-0.02em"}}>Archives</h2>
        </div>
        <div style={{display:"grid",gap:2}}>
          {ARCHIVES.map(({year,works})=>(
            <div key={year} style={{border:`1px solid ${t.border}`,borderRadius:2,overflow:"hidden"}}>
              <button onClick={()=>setOpenYear(openYear===year?null:year)}
                style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.25rem 1.5rem",background:t.bg3,border:"none",cursor:"pointer",color:t.text}}>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <Archive size={16} color={t.dimmer}/>
                  <span style={{fontSize:22,fontWeight:900,letterSpacing:"-0.02em",textTransform:"uppercase"}}>{year}</span>
                  <span style={{fontSize:11,color:t.dimmer,letterSpacing:"0.12em",textTransform:"uppercase"}}>{works.length} work{works.length!==1?"s":""}</span>
                </div>
                <span style={{color:t.dimmer,fontSize:18,transition:"transform 0.3s",display:"inline-block",transform:openYear===year?"rotate(45deg)":"rotate(0deg)"}}>+</span>
              </button>
              {openYear===year && (
                <div style={{padding:"1rem 1.5rem 1.5rem",background:t.bg2,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
                  {works.map(w=>(
                    <div key={w.id} style={{border:`1px solid ${t.border}`,borderRadius:2,padding:"1rem",background:t.bg3}}>
                      <div style={{width:"100%",height:90,background:t.bg4,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,borderRadius:1}}>
                        <svg viewBox="0 0 60 60" width="36" height="36" stroke={t.text} fill="none" strokeWidth="1.5" opacity="0.15">
                          <circle cx="30" cy="30" r="24" strokeDasharray="4 5"/><path d="M15 30 Q30 10 45 30 Q30 50 15 30"/>
                        </svg>
                      </div>
                      <h4 style={{fontSize:13,fontWeight:800,color:t.text,textTransform:"uppercase",letterSpacing:"0.04em",margin:"0 0 4px"}}>{w.title}</h4>
                      <p style={{fontSize:10,color:t.dim,textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 8px"}}>{w.medium} · {w.size}</p>
                      <p style={{fontSize:12,color:t.muted,lineHeight:1.6,margin:"0 0 10px"}}>{w.description}</p>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {w.tags.map(tag=><span key={tag} style={{fontSize:9,color:t.tag,border:`1px solid ${t.border}`,padding:"2px 6px",borderRadius:1,letterSpacing:"0.08em",textTransform:"uppercase"}}>{tag}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const AboutSection = ({ t }) => {
  const [ref, visible] = useInView();
  return (
    <section id="about" style={{background:t.bg,borderTop:`1px solid ${t.border}`,padding:"6rem 2rem",transition:"background 0.4s"}}>
      <div ref={ref} style={{maxWidth:1100,margin:"0 auto",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>
        <div style={{marginBottom:"3rem"}}>
          <p style={{fontSize:11,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 8px"}}>The Artist</p>
          <h2 style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"-0.02em"}}>About Me</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"start"}}>
          <div>
            <div style={{width:"100%",aspectRatio:"3/4",background:t.bg4,border:`1px solid ${t.border}`,borderRadius:2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,overflow:"hidden"}}>
              {/* zastąp: <img src="twoje-zdjecie.jpg" style={{width:"100%",height:"100%",objectFit:"cover"}}/> */}
              <User size={48} color={t.border2}/>
              <p style={{fontSize:11,color:t.dimmest,letterSpacing:"0.15em",textTransform:"uppercase",margin:0}}>Photo placeholder</p>
            </div>
          </div>
          <div style={{paddingTop:"0.5rem"}}>
            <p style={{fontSize:15,color:t.muted,lineHeight:1.8,marginBottom:"1.5rem"}}>
              Tu wpisz swój opis. Kim jesteś, skąd pochodzi twój styl, co cię inspiruje. Możesz opisać swoją drogę od pierwszego tagu do galerii, połączenie blackletter z wildstyle, pracę z tuszem i sprejem.
            </p>
            <p style={{fontSize:15,color:t.dim,lineHeight:1.8,marginBottom:"2rem"}}>
              Drugi akapit — możesz opisać swoje wystawy, projekty, współprace lub filozofię twórczą.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:"2rem"}}>
              {[["Based in","Polska"],["Style","Calligraffiti"],["Medium","Ink & Spray"],["Since","2020"]].map(([k,v])=>(
                <div key={k} style={{borderTop:`1px solid ${t.border}`,paddingTop:12}}>
                  <p style={{fontSize:10,color:t.dimmer,textTransform:"uppercase",letterSpacing:"0.15em",margin:"0 0 4px"}}>{k}</p>
                  <p style={{fontSize:15,fontWeight:700,color:t.text,margin:0,textTransform:"uppercase",letterSpacing:"0.05em"}}>{v}</p>
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
  const inp = {background:t.inputBg,border:`1px solid ${t.border2}`,color:t.text,padding:"12px 14px",borderRadius:2,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <section id="contact" style={{background:t.bg2,borderTop:`1px solid ${t.border}`,padding:"6rem 2rem",transition:"background 0.4s"}}>
      <div ref={ref} style={{maxWidth:700,margin:"0 auto",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>
        <p style={{fontSize:11,letterSpacing:"0.3em",color:t.dimmer,textTransform:"uppercase",margin:"0 0 8px"}}>Get In Touch</p>
        <h2 style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900,color:t.text,margin:"0 0 0.5rem",textTransform:"uppercase",letterSpacing:"-0.02em"}}>Contact</h2>
        <p style={{color:t.dim,marginBottom:"2.5rem",lineHeight:1.7}}>Commission inquiries, collaborations, exhibition bookings, or just to say hello.</p>
        <div style={{display:"flex",gap:20,marginBottom:"3rem",flexWrap:"wrap"}}>
          {SOCIALS.map(({label,href,Icon})=>(
            <a key={label} href={href} style={{display:"flex",alignItems:"center",gap:8,color:t.dim,fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none",padding:"8px 0",borderBottom:"1px solid transparent",transition:"color 0.2s,border-color 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color=t.text;e.currentTarget.style.borderBottomColor=t.border2}}
              onMouseLeave={e=>{e.currentTarget.style.color=t.dim;e.currentTarget.style.borderBottomColor="transparent"}}>
              <Icon size={16}/>{label}
            </a>
          ))}
        </div>
        {sent ? (
          <p style={{color:t.muted,fontSize:15}}>✓ Thank you. I'll respond within 48 hours.</p>
        ) : (
          <div style={{display:"grid",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {["name","email"].map(f=>(
                <input key={f} placeholder={f.charAt(0).toUpperCase()+f.slice(1)} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} style={inp}/>
              ))}
            </div>
            <textarea placeholder="Message" rows={5} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{...inp,resize:"vertical"}}/>
            <button onClick={()=>{if(form.name&&form.email)setSent(true)}} style={{alignSelf:"flex-start",display:"flex",alignItems:"center",gap:8,padding:"12px 28px",background:t.btnBg,color:t.btnText,border:"none",borderRadius:2,fontSize:12,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer"}}>
              <Send size={14}/> Send Message
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = ({ t, isDark, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);
  const scroll = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:500,transition:"background 0.4s,border-color 0.4s",background:scrolled?t.navBg:"transparent",backdropFilter:scrolled?"blur(10px)":"none",borderBottom:`1px solid ${scrolled?t.border:"transparent"}`,padding:"1rem 2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:14,fontWeight:900,letterSpacing:"0.2em",color:t.text,textTransform:"uppercase",transition:"color 0.4s"}}>UniCali</span>
      <div style={{display:"flex",alignItems:"center",gap:24}}>
        {["gallery","archives","about","contact"].map(s=>(
          <button key={s} onClick={()=>scroll(s)} style={{background:"none",border:"none",color:t.dim,fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",padding:"4px 0",transition:"color 0.3s"}}
            onMouseEnter={e=>e.currentTarget.style.color=t.text}
            onMouseLeave={e=>e.currentTarget.style.color=t.dim}>
            {s}
          </button>
        ))}
        {/* ─── THEME TOGGLE ─── */}
        <button onClick={toggleTheme} title={isDark?"Switch to light":"Switch to dark"}
          style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:2,background:"none",border:`1px solid ${t.border2}`,cursor:"pointer",color:t.muted,transition:"all 0.3s",marginLeft:8}}
          onMouseEnter={e=>{e.currentTarget.style.background=t.bg4;e.currentTarget.style.color=t.text}}
          onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=t.muted}}>
          {isDark ? <Sun size={15}/> : <Moon size={15}/>}
        </button>
      </div>
    </nav>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [selected, setSelected] = useState(null);
  const galleryRef = useRef(null);
  const t = isDark ? T.dark : T.light;

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:t.bg,minHeight:"100vh",color:t.text,transition:"background 0.4s,color 0.4s"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}input::placeholder,textarea::placeholder{color:#999}@media(max-width:900px){.masonry-grid{--cols:2!important}}@media(max-width:560px){.masonry-grid{--cols:1!important}}`}</style>
      <Nav t={t} isDark={isDark} toggleTheme={()=>setIsDark(d=>!d)}/>
      <Hero t={t} onScrollDown={()=>galleryRef.current?.scrollIntoView({behavior:"smooth"})}/>
      <Gallery t={t} onOpen={setSelected} galleryRef={galleryRef}/>
      <ArchivesSection t={t}/>
      <AboutSection t={t}/>
      <Contact t={t}/>
      <footer style={{background:t.bg,borderTop:`1px solid ${t.border}`,padding:"2rem",textAlign:"center"}}>
        <p style={{fontSize:11,color:t.dimmest,letterSpacing:"0.15em",textTransform:"uppercase",margin:0}}>© 2026 UniCali — All works reserved</p>
      </footer>
      {selected && <Modal art={selected} onClose={()=>setSelected(null)} t={t}/>}
    </div>
  );
}
