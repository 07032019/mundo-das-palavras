
import React from 'react';

interface VisualFeedbackProps {
  type: 'balloon' | 'star' | 'confetti' | 'fireworks';
}

const VisualFeedback: React.FC<VisualFeedbackProps> = ({ type }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex justify-center items-center overflow-hidden">
      {type === 'balloon' && (
        <div className="relative w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-6xl animate-float-up"
              style={{
                left: `${15 + i * 15}%`,
                bottom: '-100px',
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            >
              🎈
            </div>
          ))}
        </div>
      )}

      {type === 'star' && (
        <div className="relative w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-4xl animate-float-up"
              style={{
                left: `${10 + i * 8}%`,
                bottom: '-100px',
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      )}

      {type === 'confetti' && (
        <div className="relative w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`absolute w-3 h-3 rounded-sm animate-confetti-fall`}
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {type === 'fireworks' && (
        <div className="relative w-full h-full">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="absolute animate-firework-pop"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <div className="relative">
                {[...Array(8)].map((_, j) => (
                  <div 
                    key={j}
                    className="absolute w-2 h-6 bg-yellow-400 rounded-full"
                    style={{
                      transform: `rotate(${j * 45}deg) translateY(-20px)`,
                      opacity: 0,
                      animation: `firework-spark 1.5s ease-out forwards ${i * 0.5}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes firework-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes firework-spark {
          0% { transform: rotate(var(--tw-rotate)) translateY(0); opacity: 1; }
          100% { transform: rotate(var(--tw-rotate)) translateY(-40px); opacity: 0; }
        }
        .animate-float-up { animation: float-up forwards linear; }
        .animate-confetti-fall { animation: confetti-fall forwards ease-in; }
        .animate-firework-pop { animation: firework-pop 1.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default VisualFeedback;
