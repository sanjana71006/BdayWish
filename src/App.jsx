import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const emojis = ["🎉", "🎂", "💕", "🎈", "✨", "🐒", "💫"];

const cards = [
  { id: 1, img: "/cards/1.png", text: "Hi Raiyu 🐒 — my favorite monkey!" },
  { id: 2, img: "/cards/2.png", text: "You're always there for me 💕" },
  { id: 3, img: "/cards/3.png", text: "You support me in everything 💪" },
  { id: 4, img: "/cards/4.png", text: "You make life lighter & happier ✨" },
  { id: 5, img: "/cards/5.png", text: "Happy Birthday Raiyan 🎂💖" },
  { id: 6, img: "/cards/6.png", text: "Wishing you endless joy and laughter 🌟💝" },
];

const backgrounds = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg", "/bg4.jpg"];

export default function App() {
  const [stage, setStage] = useState("greeting");
  const [confetti, setConfetti] = useState(true); // Always show confetti
  const [bgIndex, setBgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef(null);
  // per-card interaction state: flipped (showing back) and revealed (image revealed)
  const [cardStates, setCardStates] = useState(() =>
    Object.fromEntries(cards.map((c) => [c.id, { flipped: false, revealed: false }]))
  );
  const cardStatesRef = () => cardStates;
  // password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const passwordRef = useRef(null);

  // Auto background transition
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000); // change every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // Autoplay music and handle autoplay-block fallback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(() => {
          // Autoplay blocked by browser. Listen for a user gesture to resume.
          console.log("Autoplay blocked");
          setAutoplayBlocked(true);

          const resumeOnInteraction = () => {
            audio.play()
              .then(() => {
                setIsPlaying(true);
                setAutoplayBlocked(false);
              })
              .catch(() => {
                // still blocked or failed; leave overlay visible
                setAutoplayBlocked(true);
              });
          };

          // Try once on next user interaction (click, touch or key)
          const opts = { once: true };
          window.addEventListener("pointerdown", resumeOnInteraction, opts);
          window.addEventListener("touchstart", resumeOnInteraction, opts);
          window.addEventListener("keydown", resumeOnInteraction, opts);
        });
    };

    tryPlay();

    return () => {
      // no-op cleanup; pointerdown uses { once: true }
    };
  }, []);

  const FloatEmoji = ({ emoji }) => (
    <motion.div
      className="absolute text-3xl pointer-events-none"
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ y: "-10vh", opacity: [0, 1, 0] }}
      transition={{
        duration: 8 + Math.random() * 5,
        repeat: Infinity,
        delay: Math.random() * 4,
      }}
      style={{ left: Math.random() * 100 + "vw" }}
    >
      {emoji}
    </motion.div>
  );

  // Finger component: render the index-finger emoji (uses system emoji)
  const Finger = () => {
    return (
      <span className="finger-emoji" aria-hidden>
        ☝️
      </span>
    );
  };

  // ⭐ Star for night background
  const Star = () => {
    const top = Math.random() * 100 + "%";
    const left = Math.random() * 100 + "%";
    const size = Math.random() * 3 + 1 + "px";
    const delay = Math.random() * 2;

    return (
      <motion.div
        className="absolute bg-white rounded-full pointer-events-none"
        style={{ top, left, width: size, height: size }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
      />
    );
  };

  // 🌠 Shooting stars
  const ShootingStar = () => {
    const delay = Math.random() * 8;
    const top = Math.random() * 60 + "%";
    return (
      <motion.div
          className="absolute h-[2px] w-32 bg-gradient-to-r from-white to-transparent rounded-full blur-[1px] pointer-events-none"
        style={{ top, left: "-10%" }}
        animate={{
          x: ["0%", "120%"],
          y: ["0%", "60%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.5,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  };

  // Handle front tap: show tap animation then flip
  const handleFrontTap = (cardId) => {
    // set a transient tapped flag to trigger ripple animation
    setCardStates((prev) => ({ ...prev, [cardId]: { ...prev[cardId], tapped: true } }));

    // after short delay, flip the card and clear tapped flag
    setTimeout(() => {
      setCardStates((prev) => ({ ...prev, [cardId]: { ...prev[cardId], tapped: false, flipped: true } }));
    }, 320);
  };

  // Password validation for entering cards
  const PASSWORD = "15112003"; // DOB of Raiyu
  useEffect(() => {
    if (showPasswordModal && passwordRef.current) {
      // focus input when modal opens
      try { passwordRef.current.focus(); } catch (e) {}
    }
  }, [showPasswordModal]);

  const submitPassword = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (passwordInput === PASSWORD) {
      setPasswordError("");
      setShowPasswordModal(false);
      setPasswordInput("");
      setStage("cards");
    } else {
      setPasswordError("Incorrect password. Please enter Raiyu's DOB as DDMMYYYY.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex justify-center items-center text-white">
  {/* 🎵 Music */}
  <audio ref={audioRef} src="/birthday.mp3" loop playsInline preload="auto" autoPlay />

      {/* Fallback overlay when autoplay is blocked */}
      {autoplayBlocked && !isPlaying && (
        <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none">
          <button
            onClick={() => {
              const audio = audioRef.current;
              if (!audio) return;
              audio.play()
                .then(() => {
                  setIsPlaying(true);
                  setAutoplayBlocked(false);
                })
                .catch(() => {
                  setAutoplayBlocked(true);
                });
            }}
            className="pointer-events-auto mb-8 bg-black/70 text-white px-5 py-3 rounded-full font-semibold shadow-lg"
          >
            🎧 Tap to enable sound
          </button>
        </div>
      )}

      {/* 🎉 Confetti - Show on all pages (non-interactive) */}
      {confetti && <Confetti style={{ pointerEvents: 'none', zIndex: 20 }} />}

      {/* Password modal for Click Me */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 px-4"
          style={{ zIndex: 99999 }}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowPasswordModal(false); }}
        >
          <form
            onSubmit={submitPassword}
            className="bg-white/95 dark:bg-black/80 text-black dark:text-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            style={{ zIndex: 100000 }}
          >
            <h3 className="text-lg font-semibold mb-2">Enter password to continue</h3>
            <p className="text-sm opacity-80 mb-4">Enter Raiyu's date of birth (DDMMYYYY).</p>
            <div className="flex flex-col gap-2">
              <input
                ref={passwordRef}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                inputMode="numeric"
                pattern="\d{8}"
                maxLength={8}
                placeholder="DDMMYYYY"
                className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
              />
              {passwordError && <div className="text-sm text-red-600">{passwordError}</div>}
            </div>

            <div className="mt-4 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setPasswordError(''); }} className="px-4 py-2 rounded-lg bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-pink-500 text-white">Submit</button>
            </div>
          </form>
        </div>
      )}

      {/* 🖼️ Animated background change */}
      <motion.div
        key={bgIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgrounds[bgIndex]})`,
          filter: stage === "end" ? "brightness(0.3)" : "brightness(0.7)",
        }}
      ></motion.div>

      {/* Floating emojis */}
      {stage === "greeting" && emojis.map((e, i) => <FloatEmoji emoji={e} key={i} />)}

      {/* Greeting Page */}
      {stage === "greeting" && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl px-10 py-8 text-center max-w-md z-50"
        >
          <h1 className="text-3xl font-extrabold mb-4 animate-pulse">🎂 Happy Birthday, Raiyu 🐒</h1>

          <p className="text-lg font-medium mb-6 typing-text">You're the most caring and hilarious buddy 💫🐒</p>

          <button
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                } else {
                  audioRef.current.play();
                  setIsPlaying(true);
                }
              }
            }}
            className="mb-4 bg-blue-500 text-white px-4 py-2 font-bold rounded-full hover:scale-110 transition-transform"
          >
            {isPlaying ? "🎵 Pause the Beat" : "🎵 Play the Beat"}
          </button>

          <video 
            src="/birthday.mp4" 
            className="w-40 mx-auto rounded-xl shadow-lg" 
            autoPlay 
            loop 
            muted
          />

          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-red-500 px-4 py-2 font-bold rounded-full hover:scale-110 transition-all animate-heartbeat"
            >
              💌 Click Me
            </button>
          </div>

          <p className="text-sm opacity-80 mt-4">Made with 💖 for my best friend Raiyan</p>
        </motion.div>
      )}

      {/* Card Gallery */}
      {stage === "cards" && (
        <motion.div
          className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex gap-6 px-6 sm:px-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-8 touch-pan-x">
            {cards.map((card, index) => {
              const state = cardStatesRef()[card.id];
              const flipped = state?.flipped;
              const revealed = state?.revealed;

              return (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.03 }}
                  className="snap-center bg-white text-black shadow-2xl rounded-3xl p-4 min-w-[70vw] sm:min-w-[260px] flex items-center justify-center hover:shadow-pink-500/60"
                >
                  <div
                    className={`relative flip-card ${flipped ? 'flipped' : ''}`}
                    style={{ borderRadius: 12, width: '66vw', height: '86vw', maxWidth: 256, maxHeight: 320 }}
                  >
                    <div className="flip-card-inner">
                      {/* Front: text + index finger */}
                      <div
                        className="flip-card-front bg-white rounded-xl p-4 shadow-inner text-center flex flex-col justify-center items-center"
                        onClick={() => handleFrontTap(card.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleFrontTap(card.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <p className="font-semibold text-sm sm:text-base px-2">{card.text}</p>
                        <div className="card-finger relative mt-3 flex items-center justify-center">
                          {/* Ripple element positioned behind the finger */}
                          <span className={`finger-ripple ${cardStates[card.id]?.tapped ? 'animate' : ''}`} />

                          {/* Finger (emoji or image) */}
                          <div className="touch-target p-1 -mt-1">
                            <Finger />
                          </div>
                        </div>
                      </div>

                      {/* Back: gift box or revealed image */}
                      <div className="flip-card-back bg-white rounded-xl p-2 shadow-inner flex items-center justify-center">
                        {!revealed ? (
                          <div
                            className="gift-box flex flex-col items-center justify-center h-full cursor-pointer px-4"
                            onClick={() => {
                              setCardStates((prev) => ({ ...prev, [card.id]: { ...prev[card.id], revealed: true } }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setCardStates((prev) => ({ ...prev, [card.id]: { ...prev[card.id], revealed: true } }));
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="gift-box text-4xl sm:text-5xl">🎁</div>
                            <p className="text-xs sm:text-sm opacity-80 mt-2">Tap the gift</p>
                          </div>
                        ) : (
                          <img src={card.img} alt="card" className="w-full h-full object-cover rounded-xl" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* If last card, keep the Click me button below the card */}
                  {index === cards.length - 1 && (
                    <div className="flex flex-col items-center ml-4">
                      <button
                        onClick={() => setStage("end")}
                        className="mt-6 bg-gradient-to-r from-pink-500 to-yellow-400 px-4 py-2 rounded-full text-white font-bold hover:scale-110 transition-transform"
                      >
                        💌Click me
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Fairytale Ending */}
      {stage === "end" && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gradient-to-b from-black via-indigo-950 to-purple-950 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Static stars */}
          {Array.from({ length: 80 }).map((_, i) => (
            <Star key={i} />
          ))}

          {/* Shooting stars */}
          {Array.from({ length: 3 }).map((_, i) => (
            <ShootingStar key={i} />
          ))}

          <motion.h2
            className="text-4xl font-extrabold mb-6 animate-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🌟 Thank You, Raiyan 🌟
          </motion.h2>

          <motion.p
            className="max-w-lg text-lg opacity-90 leading-relaxed mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            For being the most supportive, kind, and funny friend ever 💖  
            You bring light like stars in my sky 🌌  
            Never change, my favorite monkey 🐒✨
          </motion.p>

          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-10">
            💖
          </motion.div>

          <button onClick={() => window.location.reload()} className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-full hover:scale-110 transition-transform shadow-lg">
            Replay Magic ✨
          </button>
        </motion.div>
      )}
    </div>
  );
}
