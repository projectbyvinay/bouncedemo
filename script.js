document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];

  // Header state
  const header = $(".site-header");
  const syncHeader = () => header.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", syncHeader, {passive:true});
  syncHeader();

  // Smooth anchor transitions
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const el = $(a.getAttribute("href"));
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:"smooth", block:"start"});
  }));

  // Hero video cross-fade
  const videos = $$(".hero-video");
  const indexEl = $(".hero-index");
  let videoIndex = 0;
  let paused = false;
  let timer;

  const showVideo = (next) => {
    videoIndex = (next + videos.length) % videos.length;
    videos.forEach((v,i) => {
      v.classList.toggle("is-active", i === videoIndex);
      if(i === videoIndex && !paused) v.play().catch(()=>{});
    });
    indexEl.textContent = String(videoIndex + 1).padStart(2,"0");
  };
  const scheduleVideo = () => {
    clearInterval(timer);
    timer = setInterval(() => { if(!paused) showVideo(videoIndex + 1); }, 6500);
  };
  scheduleVideo();

  $(".video-toggle").addEventListener("click", () => {
    paused = !paused;
    videos.forEach(v => paused ? v.pause() : v.play().catch(()=>{}));
    $(".video-toggle span:last-child").textContent = paused ? "Play film" : "Pause film";
    $(".pause-icon").textContent = paused ? "▶" : "Ⅱ";
  });

  // Gallery slider
  const slides = $$(".work-slide");
  const count = $(".slide-count b");
  let slide = 0;
  const updateSlide = (next) => {
    slide = (next + slides.length) % slides.length;
    slides.forEach((s,i) => s.classList.toggle("active", i === slide));
    count.textContent = String(slide + 1).padStart(2,"0");
  };
  $(".slide-prev").addEventListener("click", () => updateSlide(slide - 1));
  $(".slide-next").addEventListener("click", () => updateSlide(slide + 1));
  let autoGallery = setInterval(() => updateSlide(slide + 1), 5000);
  [$(".slide-prev"),$(".slide-next")].forEach(btn => btn.addEventListener("click",()=>{clearInterval(autoGallery);autoGallery=setInterval(()=>updateSlide(slide+1),5000)}));

  // Mobile menu
  const menuBtn = $(".menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuBtn.innerHTML = open ? '<i></i><i></i><span class="mobile-menu"><a href="#about">About</a><a href="#services">Services</a><a href="#work">Our work</a><a href="#visit">Visit</a></span>' : '<i></i><i></i>';
    if(open){
      $$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{document.body.classList.remove("menu-open");menuBtn.innerHTML='<i></i><i></i>'}));
    }
  });

  // GSAP reveals + parallax
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".hero .reveal",
      {y:55, opacity:0},
      {y:0, opacity:1, duration:1.05, stagger:.08, ease:"power4.out", delay:.25}
    );

    gsap.utils.toArray(".reveal:not(.hero .reveal)").forEach(el => {
      gsap.fromTo(el, {y:50, opacity:0}, {
        y:0, opacity:1, duration:1, ease:"power4.out",
        scrollTrigger:{trigger:el, start:"top 86%", once:true}
      });
    });

    gsap.utils.toArray(".parallax img").forEach(img => {
      gsap.fromTo(img, {yPercent:-7}, {
        yPercent:7, ease:"none",
        scrollTrigger:{trigger:img.parentElement, start:"top bottom", end:"bottom top", scrub:true}
      });
    });

    gsap.fromTo(".service-card", {y:70, opacity:0}, {
      y:0, opacity:1, duration:.9, stagger:.12, ease:"power3.out",
      scrollTrigger:{trigger:".service-list", start:"top 80%", once:true}
    });

    gsap.fromTo(".work-slider", {clipPath:"inset(0 0 0 12%)"}, {
      clipPath:"inset(0 0 0 0)", duration:1.2, ease:"power4.out",
      scrollTrigger:{trigger:".work", start:"top 75%", once:true}
    });
  } else {
    $$(".reveal").forEach(el => el.style.opacity=1);
  }

  $("#year").textContent = new Date().getFullYear();
});