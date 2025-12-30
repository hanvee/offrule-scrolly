// Next, React
import { FC, useState, useEffect } from 'react';
import pkg from '../../../package.json';

// ❌ DO NOT EDIT ANYTHING ABOVE THIS LINE

export const HomeView: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* HEADER – fake Scrolly feed tabs */}
      <header className="flex items-center justify-center border-b border-white/10 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px]">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
            Feed
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Casino
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Kids
          </button>
        </div>
      </header>

      {/* MAIN – central game area (phone frame) */}
      <main className="flex flex-1 items-center justify-center px-4 py-3">
        <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
          {/* Fake “feed card” top bar inside the phone */}
          <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide">
              Scrolly Game
            </span>
            <span className="text-[9px] opacity-70">#NoCodeJam</span>
          </div>

          {/* The game lives INSIDE this phone frame */}
          <div className="flex h-[calc(100%-26px)] flex-col items-center justify-start px-3 pb-3 pt-1">
            <GameSandbox />
          </div>
        </div>
      </main>

      {/* FOOTER – tiny version text */}
      <footer className="flex h-5 items-center justify-center border-t border-white/10 px-2 text-[9px] text-slate-500">
        <span>Scrolly · v{pkg.version}</span>
      </footer>
    </div>
  );
};

// ✅ THIS IS THE ONLY PART YOU EDIT FOR THE JAM
// Replace this entire GameSandbox component with the one AI generates.
// Keep the name `GameSandbox` and the `FC` type.

const GameSandbox: FC = () => {
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [currentRule, setCurrentRule] = useState<string>('');
  const [items, setItems] = useState<any[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number>(0);
  const [correctTap, setCorrectTap] = useState<number | null>(null);
  const [wrongTap, setWrongTap] = useState(false);
  const [showComboFeedback, setShowComboFeedback] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(true);

  // Original asset arrays
  const shapes = ['circle', 'square', 'triangle'];
  const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#C7CEEA'];
  // Removed fixed pixel sizes in favor of visual scaling
  const sizes = ['small', 'medium', 'large']; 
  const motions = ['static', 'blink', 'rotate', 'pulse'];

  const rules = [
    { type: 'color', text: 'All shapes must be the same color' },
    { type: 'shape', text: 'All shapes must be the same' },
    { type: 'size', text: 'All shapes must be the same size' },
    { type: 'motion', text: 'Nothing should be moving' },
    { type: 'rotation', text: 'Nothing should be rotating' },
    { type: 'blink', text: 'Nothing should be blinking' },
  ];

  // RESTORED: Original game mechanic progression
  // Updated with explicit score argument for reliable restarts
  const generateRound = (currentScore = score) => {
    // Difficulty tiers:
    // 0-5: 6 items (3x2)
    // 6+: 9 items (3x3) -- MAX CAP CHANGED TO 3x3
    let numItems = 6;
    if (currentScore >= 6) numItems = 9;
    // Removed 12 items tier as max grid is now 3x3

    const rule = rules[Math.floor(Math.random() * Math.min(4 + Math.floor(currentScore / 5), rules.length))] || rules[0];
    setCurrentRule(rule.text);
    // ... rest of generation logic uses variables not dependent on score directly
    
    let baseColor = colors[Math.floor(Math.random() * colors.length)];
    let baseShape = shapes[Math.floor(Math.random() * shapes.length)];
    let baseSize = sizes[1]; // medium default
    let baseMotion = 'static';

    const newItems = [];
    const wrongIdx = Math.floor(Math.random() * numItems);
    setWrongIndex(wrongIdx);

    for (let i = 0; i < numItems; i++) {
        // ... (Item generation loop remains same, utilizing local vars)
      let item: any = {
        shape: baseShape,
        color: baseColor,
        size: baseSize,
        motion: baseMotion,
      };

      if (i === wrongIdx) {
        if (rule.type === 'color') {
          item.color = colors.find(c => c !== baseColor) || colors[0];
        } else if (rule.type === 'shape') {
          item.shape = shapes.find(s => s !== baseShape) || shapes[0];
        } else if (rule.type === 'size') {
          item.size = sizes.find(s => s !== baseSize) || sizes[0];
        } else if (rule.type === 'motion') {
          item.motion = 'pulse'; // STRICTLY 'pulse' for "Nothing should be moving"
        } else if (rule.type === 'rotation') {
          item.motion = 'rotate'; // STRICTLY 'rotate'
        } else if (rule.type === 'blink') {
          item.motion = 'blink'; // STRICTLY 'blink'
        }
      } else {
        // Random distractors based on type
        if (rule.type !== 'color' && Math.random() > 0.3) {
          item.color = colors[Math.floor(Math.random() * colors.length)];
        }
        if (rule.type !== 'shape' && Math.random() > 0.5) {
          item.shape = shapes[Math.floor(Math.random() * shapes.length)];
        }
        if (rule.type !== 'size' && Math.random() > 0.6) {
          item.size = sizes[Math.floor(Math.random() * sizes.length)];
        }
        // NOTE: We do NOT randomize motion for distractors to keep the rule clear.
        // All correct items remain 'static' when the rule is about motion/rotation/blink.
      }
      newItems.push(item);
    }

    setItems(newItems);
    setTimeLeft(100);
  };

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    // Aggressive speed scaling: Starts at 100ms, gets 3ms faster per point, caps at 25ms.
    const tickRate = Math.max(25, 100 - (score * 3));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, tickRate);
    return () => clearInterval(timer);
  }, [gameState, score]);

  const handleItemClick = (index: number) => {
    if (gameState !== 'playing') return;

    if (index === wrongIndex) {
      // Play correct sound
      const audio = new Audio('/sfx/correct-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error('Audio play failed', e));

      setCorrectTap(index);
      setShowComboFeedback(true);
      
      setTimeout(() => {
        setCorrectTap(null);
        setShowComboFeedback(false);
      }, 500);

      setItemsVisible(false);
      
      setTimeout(() => {
        const newScore = score + 1;
        setScore(newScore);
        setCombo(combo + 1);
        generateRound(newScore); // Pass updated score explicitly
        setItemsVisible(true);
      }, 250);
    } else {
      // Play wrong sound
      const audio = new Audio('/sfx/wrong-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error('Audio play failed', e));

      setWrongTap(true);
      setTimeout(() => {
        setWrongTap(false);
        setGameState('gameover');
      }, 300);
    }
  };

  const restart = () => {
    setScore(0);
    setCombo(0);
    setGameState('playing');
    // Force generate round with 0 score to reset grid immediately
    generateRound(0);
  };

  // SCALE FACTORS instead of fixed pixels to maintain responsive layouts
  const sizeScales = {
    small: 'scale-75',
    medium: 'scale-90',
    large: 'scale-100',
  };

  const getShapeStyle = (shape: string) => {
    if (shape === 'circle') return 'rounded-full';
    if (shape === 'square') return 'rounded-lg';
    return '';
  };

  // Distinct animations avoiding transform conflicts
  const getMotionClass = (motion: string, shape: string) => {
    if (motion === 'blink') return 'animate-hard-blink';
    if (motion === 'rotate') return 'animate-spin-slow';
    if (motion === 'pulse') {
      // Circles bounce vertically to distinct from rotation
      if (shape === 'circle') return 'animate-move-vertical';
      // Squares/Triangles wiggle in a path
      return 'animate-wiggle'; 
    }
    return '';
  };

  return (
    // FIX: Single invariant root container with FORCE-FIXED full dimensions
    <div 
      className={`flex w-full h-full flex-col overflow-hidden transition-all ${wrongTap ? 'animate-shake' : ''}`}
      style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
    >
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes hardBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Vertical Bounce for Circle Moving */
        @keyframes moveVertical {
          0%, 100% { transform: translateY(-8px); }
          50% { transform: translateY(8px); }
        }
        /* Box/Wiggle Path for Polygon Moving */
        @keyframes wiggle {
          0% { transform: translate(0, 0); }
          25% { transform: translate(6px, 0); }
          50% { transform: translate(6px, 6px); }
          75% { transform: translate(0, 6px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes correctPop {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.8); }
          50% { box-shadow: 0 0 30px 15px rgba(56, 189, 248, 0.4); }
          100% { box-shadow: 0 0 50px 25px rgba(56, 189, 248, 0); }
        }
        @keyframes wrongFlash {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          50% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.8), 0 0 30px 10px rgba(239, 68, 68, 0.4); }
        }
        @keyframes comboPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes burstParticle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: var(--burst-direction) scale(0.5); opacity: 0; }
        }
        @keyframes scoreBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-hard-blink { animation: hardBlink 1s step-end infinite; }
        .animate-spin-slow { animation: spinSlow 3s linear infinite; }
        .animate-move-vertical { animation: moveVertical 1.5s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s linear infinite; }
        
        .animate-correct-pop { animation: correctPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-glow-pulse { animation: glowPulse 0.5s ease-out; }
        .animate-wrong-flash { animation: wrongFlash 0.3s ease-out; }
        .animate-combo-pulse { animation: comboPulse 0.3s ease-out; }
        .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out; }
        .animate-burst { animation: burstParticle 0.6s ease-out forwards; }
        .animate-score-bounce { animation: scoreBounce 0.3s ease-in-out; }
      `}</style>
      
      {gameState === 'gameover' ? (
        // Game Over View ...
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-center text-white animate-fade-in-scale">
          <div className="text-6xl animate-bounce">😵</div>
          <div>
            <div className="text-4xl font-bold">Game Over</div>
            <div className="mt-2 text-xl text-slate-400">Score: {score}</div>
            {combo > 2 && <div className="mt-1 text-sm text-cyan-400">Best combo: {combo}</div>}
          </div>
          <button
            onClick={restart}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
          >
            Play Again
          </button>
        </div>
      ) : (
        // Playing View
        <div className="flex w-full h-full flex-col gap-3">
          {/* Top Bar - uses exact height to prevent jumping */}
          <div className="flex w-full shrink-0 items-center justify-between px-1 h-8">
            <div className={`text-2xl font-bold text-white transition-all ${showComboFeedback ? 'animate-score-bounce' : ''}`}>
              {score}
            </div>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100 ease-linear"
                style={{ width: `${timeLeft}%` }}
              />
            </div>
          </div>

          {/* Rule Card */}
          <div className={`w-full shrink-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 text-center backdrop-blur-sm transition-all duration-300 ${showComboFeedback ? 'from-cyan-500/30 to-blue-500/30' : ''}`}>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/90">{currentRule}</div>
          </div>

          {/* Game Grid - RESPONSIVE SIZING */}
          <div className="flex flex-1 w-full items-center justify-center overflow-hidden py-1 px-1">
            <div 
              className={`grid w-full gap-3 transition-opacity duration-200 ${itemsVisible ? 'opacity-100' : 'opacity-0'} grid-cols-3`}
            >
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleItemClick(idx)}
                  className={`relative aspect-square w-full rounded-xl bg-white/5 transition-all active:scale-95 ${itemsVisible ? 'animate-fade-in-scale' : ''}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Motion Wrapper: Handles Rotation/Movement independently to avoid transform conflicts */}
                  <div className={`absolute inset-0 flex items-center justify-center ${getMotionClass(item.motion, item.shape)}`}>
                    <div
                      // Shape & Scale Wrapper: Handles size scaling and shape style
                      className={`${sizeScales[item.size]} ${getShapeStyle(item.shape)} relative shadow-lg h-12 w-12 flex items-center justify-center ${
                        correctTap === idx ? 'animate-correct-pop animate-glow-pulse' : ''
                      } ${wrongTap ? 'animate-wrong-flash' : ''}`}
                      style={{
                        backgroundColor: item.color,
                        clipPath: item.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
                      }}
                    >
                      {/* Visual Flair Elements for Orientation */}
                      {item.shape === 'circle' && (
                        <>
                          <div className="absolute right-[15%] top-[15%] h-[15%] w-[15%] rounded-full bg-white/60 blur-[1px]" />
                          <div className="absolute left-[20%] bottom-[20%] h-[10%] w-[10%] rounded-full bg-black/20" />
                        </>
                      )}
                      {item.shape === 'square' && (
                         <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-white/30" />
                      )}
                      
                      {correctTap === idx && (
                        <>
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white animate-burst"
                              style={{
                                '--burst-direction': `rotate(${i * 45}deg) translate(40px, 0)`,
                                backgroundColor: item.color,
                                filter: 'brightness(1.5)',
                              } as any}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer / Combo */}
          <div className={`w-full shrink-0 h-6 text-center text-xs font-bold text-yellow-400 transition-all ${showComboFeedback ? 'animate-combo-pulse' : ''}`}>
             {combo > 2 && <span>🔥 Combo: {combo}</span>}
          </div>
        </div>
      )}
    </div>
  );
};
