
import React, { useState, useCallback, useEffect } from 'react';
import { SLIDES_DATA } from './constants/slides';
import type { SlideContent } from './types';
import CodeBlock from './components/CodeBlock';
import JoinDiagram from './components/JoinDiagram';
import ProgressBar from './components/ProgressBar';

const NavButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-2 rounded-md font-semibold text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 flex items-center justify-center"
    >
        {children}
    </button>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);


const App: React.FC = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [animationKey, setAnimationKey] = useState(0);

    const handleNext = useCallback(() => {
        if (currentSlideIndex < SLIDES_DATA.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
            setAnimationKey(k => k + 1);
        }
    }, [currentSlideIndex]);

    const handlePrev = useCallback(() => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
            setAnimationKey(k => k + 1);
        }
    }, [currentSlideIndex]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    const slide: SlideContent = SLIDES_DATA[currentSlideIndex];

    const slideContentClass = `w-full h-full flex flex-col items-center p-8 md:p-12 ${
        slide.isTitleSlide || slide.isSectionTitle ? 'justify-center' : 'justify-start text-left pt-12 md:pt-20'
    }`;
    
    return (
        <div className="flex flex-col h-full w-full overflow-hidden relative bg-slate-900">
            <div className="background-anim" />
            <main className="flex-grow flex flex-col relative z-10">
                <div key={animationKey} className="w-full flex-grow animate-[fadeIn_0.5s_ease-in-out]">
                     <div className={slideContentClass}>
                         <div className={`w-full max-w-5xl mx-auto ${slide.isTitleSlide || slide.isSectionTitle ? 'text-center' : ''}`}>
                            {slide.isTitleSlide ? (
                                <>
                                    <h1 className="text-4xl md:text-6xl font-bold text-sky-400 mb-4">{slide.title}</h1>
                                    {slide.subtitle && <h2 className="text-2xl md:text-3xl text-slate-300 mb-8">{slide.subtitle}</h2>}
                                    {slide.content && (
                                        <div className="text-xl text-slate-400 space-y-2">
                                            {slide.content.map((line, index) => (
                                                <p key={index}>{line}</p>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : slide.isSectionTitle ? (
                                <>
                                    <p className="text-xl md:text-2xl text-slate-400 mb-2">{slide.section}</p>
                                    <h1 className="text-4xl md:text-6xl font-bold text-sky-400">{slide.title}</h1>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold uppercase text-sky-400 tracking-wider mb-1">{slide.section}</p>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 pb-2 border-b-2 border-slate-700">{slide.title}</h1>
                                    <div className="text-xl text-slate-200 space-y-4 leading-relaxed">
                                        {slide.content?.map((item, index) => {
                                            if (item === '<br/>') return <br key={index} />;

                                            const isQuestion = item.includes('?');
                                            const hasColon = item.includes(':');

                                            if(hasColon && !isQuestion) {
                                                const parts = item.split(/:(.*)/s);
                                                const headingHTML = parts[0] + ':';
                                                const explanationHTML = parts[1] || '';

                                                return (
                                                    <div key={index} className="grid grid-cols-1 md:grid-cols-[max-content,1fr] md:gap-x-4 items-start">
                                                        <div className="font-bold" dangerouslySetInnerHTML={{ __html: headingHTML }} />
                                                        <div dangerouslySetInnerHTML={{ __html: explanationHTML.trim() }} />
                                                    </div>
                                                )
                                            }

                                            return <p key={index} dangerouslySetInnerHTML={{ __html: item }}></p>;
                                        })}
                                    </div>
                                    {slide.code && <CodeBlock code={slide.code} output={slide.codeOutput} />}
                                    {slide.isJoinDiagram && <JoinDiagram />}
                                    {slide.businessApplication && (
                                        <div className="mt-6 p-4 bg-sky-900/50 border-l-4 border-sky-500 rounded-r-lg">
                                            <h3 className="font-bold text-sky-400 text-xl">Business Application</h3>
                                            <p className="text-slate-200 mt-2 text-lg">{slide.businessApplication}</p>
                                        </div>
                                    )}
                                </>
                            )}
                         </div>
                    </div>
                </div>
            </main>
            
            <footer className="w-full p-4 bg-slate-900/80 border-t border-slate-700 backdrop-blur-sm relative z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between space-x-4">
                    <NavButton onClick={handlePrev} disabled={currentSlideIndex === 0}>
                        <ArrowLeftIcon /> Prev
                    </NavButton>
                    <div className="flex-grow flex flex-col items-center">
                        <ProgressBar current={currentSlideIndex + 1} total={SLIDES_DATA.length} />
                        <span className="text-xs text-slate-400 mt-1.5">{currentSlideIndex + 1} / {SLIDES_DATA.length}</span>
                    </div>
                    <NavButton onClick={handleNext} disabled={currentSlideIndex === SLIDES_DATA.length - 1}>
                        Next <ArrowRightIcon />
                    </NavButton>
                </div>
            </footer>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .background-anim {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #020617; /* fallback */
                    background-image: 
                        radial-gradient(at 20% 25%, hsla(222, 70%, 20%, 0.3) 0px, transparent 50%),
                        radial-gradient(at 80% 20%, hsla(219, 84%, 30%, 0.3) 0px, transparent 50%),
                        radial-gradient(at 20% 80%, hsla(200, 80%, 40%, 0.3) 0px, transparent 50%),
                        radial-gradient(at 80% 85%, hsla(280, 70%, 30%, 0.3) 0px, transparent 50%);
                    background-size: 200% 200%;
                    animation: moveBackground 30s linear infinite;
                    z-index: 0;
                }
                @keyframes moveBackground {
                    0% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                    100% { background-position: 0% 0%; }
                }
            `}</style>
        </div>
    );
};

export default App;
