// Next, React
import { FC, useState } from 'react';
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
  const [ruleType, setRuleType] = useState<string>('');
  const [items, setItems] = useState<any[]>([]);
  const [wrongIndex, setWrongIndex] = useState<number>(0);
  const [correctTap, setCorrectTap] = useState<number | null>(null);
  const [wrongTap, setWrongTap] = useState(false);
  const [showComboFeedback, setShowComboFeedback] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(true);

  const shapes = ['circle', 'square', 'triangle'];
  const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#C7CEEA'];
  const sizes = ['small', 'medium', 'large'];
  const motions = ['static', 'blink', 'rotate', 'pulse'];

  const rules = [
    { type: 'color', text: 'All shapes must be the same color' },
    { type: 'shape', text: 'All shapes must be the same' },
    { type: 'size', text: 'All items must be the same size' },
    { type: 'motion', text: 'Nothing should be moving' },
    { type: 'rotation', text: 'Nothing should be rotating' },
    { type: 'blink', text: 'Nothing should be blinking' },
  ];

  const generateRound = () => {
    const numItems = Math.min(6 + Math.floor(score / 3), 12);
    const rule = rules[Math.floor(Math.random() * Math.min(4 + Math.floor(score / 5), rules.length))];
    
    setCurrentRule(rule.text);
    setRuleType(rule.type);

    let baseColor = colors[Math.floor(Math.random() * colors.length)];
    let baseShape = shapes[Math.floor(Math.random() * shapes.length)];
    let baseSize = sizes[1];
    let baseMotion = 'static';

    const newItems = [];
    const wrongIdx = Math.floor(Math.random() * numItems);
    setWrongIndex(wrongIdx);

    for (let i = 0; i < numItems; i++) {
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
          item.motion = motions[1 + Math.floor(Math.random() * 3)];
        } else if (rule.type === 'rotation') {
          item.motion = 'rotate';
        } else if (rule.type === 'blink') {
          item.motion = 'blink';
        }
      } else {
        if (rule.type !== 'color' && Math.random() > 0.3) {
          item.color = colors[Math.floor(Math.random() * colors.length)];
        }
        if (rule.type !== 'shape' && Math.random() > 0.5) {
          item.shape = shapes[Math.floor(Math.random() * shapes.length)];
        }
        if (rule.type !== 'size' && Math.random() > 0.6) {
          item.size = sizes[Math.floor(Math.random() * sizes.length)];
        }
      }

      newItems.push(item);
    }

    setItems(newItems);
    setTimeLeft(100);
  };

  useState(() => {
    generateRound();
  });

  useState(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, Math.max(30, 100 - score * 2));
    return () => clearInterval(timer);
  });

  const handleItemClick = (index: number) => {
    if (gameState !== 'playing') return;

    if (index === wrongIndex) {
      // Correct tap feedback
      setCorrectTap(index);
      setShowComboFeedback(true);
      
      setTimeout(() => {
        setCorrectTap(null);
        setShowComboFeedback(false);
      }, 500);

      // Fade out current items
      setItemsVisible(false);
      
      setTimeout(() => {
        setScore(score + 1);
        setCombo(combo + 1);
        generateRound();
        setItemsVisible(true);
      }, 250);
    } else {
      // Wrong tap feedback
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
    generateRound();
  };

  const sizeClasses = {
    small: 'w-10 h-10 max-w-full max-h-full',
    medium: 'w-14 h-14 max-w-full max-h-full',
    large: 'w-16 h-16 max-w-full max-h-full',
  };

  const getShapeStyle = (shape: string) => {
    if (shape === 'circle') return 'rounded-full';
    if (shape === 'square') return 'rounded-lg';
    return '';
  };

  const getMotionClass = (motion: string) => {
    if (motion === 'blink') return 'animate-pulse';
    if (motion === 'rotate') return 'animate-spin';
    if (motion === 'pulse') return 'animate-bounce';
    return '';
  };

  if (gameState === 'gameover') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6">
        <div className="text-6xl">😵</div>
        <div className="text-center">
          <div className="text-4xl font-bold text-white">Game Over</div>
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
    );
  }

  return (
    <div className={`flex flex-col gap-3 transition-all duration-200 ${wrongTap ? 'animate-shake' : ''}`} style={{ width: '100%', minWidth: '100%', maxWidth: '100%' }}>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
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
          0% { 
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% { 
            transform: var(--burst-direction) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes scoreBounce {
          0% { transform: scale(1); }
          25% { transform: scale(1.3) translateY(-5px); }
          50% { transform: scale(1.1) translateY(0); }
          75% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes flashBright {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(2) saturate(1.5); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-correct-pop {
          animation: correctPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-glow-pulse {
          animation: glowPulse 0.5s ease-out;
        }
        .animate-wrong-flash {
          animation: wrongFlash 0.3s ease-out;
        }
        .animate-combo-pulse {
          animation: comboPulse 0.3s ease-out;
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out;
        }
        .animate-burst {
          animation: burstParticle 0.6s ease-out forwards;
        }
        .animate-score-bounce {
          animation: scoreBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-flash-bright {
          animation: flashBright 0.4s ease-out;
        }
      `}</style>
      
      <div className="flex items-center justify-between px-1">
        <div className={`text-2xl font-bold text-white transition-all ${showComboFeedback ? 'animate-score-bounce' : ''}`}>
          {score}
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
            style={{ width: `${timeLeft}%` }}
          />
        </div>
      </div>

      <div className={`rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-sm transition-all duration-300 ${showComboFeedback ? 'from-cyan-500/30 to-blue-500/30' : ''}`}>
        <div className="text-center text-sm font-semibold text-white">{currentRule}</div>
      </div>

      <div className={`grid gap-3 ${items.length <= 6 ? 'grid-cols-3 grid-rows-2' : 'grid-cols-4 grid-rows-3'} transition-opacity duration-200 ${itemsVisible ? 'opacity-100' : 'opacity-0'}`} style={{ width: '100%', minWidth: '100%', maxWidth: '100%' }}>
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleItemClick(idx)}
            className={`flex items-center justify-center transition-opacity ${itemsVisible ? 'animate-fade-in-scale' : ''}`}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div
              className={`${sizeClasses[item.size]} ${getShapeStyle(item.shape)} ${getMotionClass(item.motion)} shadow-lg relative shrink-0 ${
                correctTap === idx ? 'animate-correct-pop animate-glow-pulse animate-flash-bright' : ''
              } ${wrongTap ? 'animate-wrong-flash' : ''}`}
              style={{
                backgroundColor: item.color,
                clipPath: item.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
              }}
            >
              {/* Rotation indicator for circles */}
              {item.shape === 'circle' && (
                <div 
                  className="absolute w-2 h-2 rounded-full bg-white/90 shadow-md"
                  style={{
                    top: '10%',
                    right: '10%',
                  }}
                />
              )}
              
              {/* Enhanced burst particle effect for correct tap */}
              {correctTap === idx && (
                <>
                  {/* Corner particles */}
                  <div className="absolute -top-2 -left-2 w-2 h-2 rounded-full bg-cyan-400 animate-burst" 
                       style={{ '--burst-direction': 'translate(-30px, -30px)' } as any} />
                  <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-blue-400 animate-burst" 
                       style={{ '--burst-direction': 'translate(30px, -30px)' } as any} />
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-purple-400 animate-burst" 
                       style={{ '--burst-direction': 'translate(-30px, 30px)' } as any} />
                  <div className="absolute -bottom-2 -right-2 w-2 h-2 rounded-full bg-pink-400 animate-burst" 
                       style={{ '--burst-direction': 'translate(30px, 30px)' } as any} />
                  
                  {/* Cardinal direction particles */}
                  <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-yellow-300 animate-burst" 
                       style={{ '--burst-direction': 'translate(0, -40px)' } as any} />
                  <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-green-300 animate-burst" 
                       style={{ '--burst-direction': 'translate(0, 40px)' } as any} />
                  <div className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-orange-300 animate-burst" 
                       style={{ '--burst-direction': 'translate(-40px, 0)' } as any} />
                  <div className="absolute top-1/2 right-0 w-1.5 h-1.5 rounded-full bg-red-300 animate-burst" 
                       style={{ '--burst-direction': 'translate(40px, 0)' } as any} />
                  
                  {/* Expanding rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-white animate-ping" />
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" style={{ animationDelay: '0.1s' }} />
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {combo > 2 && (
        <div className={`text-center text-xs font-bold text-yellow-400 transition-all ${showComboFeedback ? 'animate-combo-pulse' : ''}`}>
          🔥 Combo: {combo}
        </div>
      )}
    </div>
  );
};