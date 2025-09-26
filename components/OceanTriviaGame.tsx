import React, { useState, useEffect } from 'react';
import { sendMessageStream } from '../services/geminiService';
import { IconTrophy, IconX, IconCheck, IconLightbulb } from './ui/Icon';
import LoadingSpinner from './ui/LoadingSpinner';
import { Filters } from '../types';

interface OceanTriviaGameProps {
  language: string;
}

interface TriviaQuestion {
    question: string;
    options: string[];
    answer: string;
    hint: string;
    explanation: string;
}

const HIGH_SCORE_KEY = 'seaVoiceTriviaHighScore';

const OceanTriviaGame: React.FC<OceanTriviaGameProps> = ({ language }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [question, setQuestion] = useState<TriviaQuestion | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isNewHighScore, setIsNewHighScore] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hintUsed, setHintUsed] = useState(false);

    useEffect(() => {
        const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore, 10));
        }
    }, []);

    const MAX_QUESTIONS = 10;
    const POINTS_PER_CORRECT_ANSWER = 5;
    const HINT_COST = 2;

    const fetchQuestion = async () => {
        setIsLoading(true);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setError(null);
        setHintUsed(false);

        try {
            const emptyFilters: Filters = {
                dateRange: { start: '', end: '' },
                sensorType: 'all',
                region: 'all',
                depthRange: { min: '', max: '' },
                floatId: '',
            };
            
            const stream = sendMessageStream(
                'Generate a new ocean trivia question.',
                [],
                language,
                emptyFilters, 
                'game_master'
            );

            let jsonResponse = '';
            for await (const chunk of stream) {
                jsonResponse += chunk;
            }

            const jsonMatch = jsonResponse.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                const parsed = JSON.parse(jsonMatch[1]);
                setQuestion(parsed);
            } else {
                try {
                    const parsed = JSON.parse(jsonResponse);
                    setQuestion(parsed);
                } catch {
                     throw new Error("Invalid response format from AI. Please try again.");
                }
            }
        } catch (err) {
            console.error("Failed to fetch trivia question:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartGame = () => {
        setScore(0);
        setQuestionCount(1);
        setGameState('playing');
        setHintUsed(false);
        setIsNewHighScore(false);
        fetchQuestion();
    };
    
    const handleAnswerSelect = (option: string) => {
        if (selectedAnswer || !question) return;

        setSelectedAnswer(option);
        const correct = option === question.answer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + POINTS_PER_CORRECT_ANSWER);
        }
    };

    const handleUseHint = () => {
        if (!hintUsed && score >= HINT_COST) {
            setScore(prev => prev - HINT_COST);
            setHintUsed(true);
        }
    };

    const handleNextQuestion = () => {
        if (questionCount < MAX_QUESTIONS) {
            setQuestionCount(prev => prev + 1);
            fetchQuestion();
        } else {
            if (score > highScore) {
                setHighScore(score);
                setIsNewHighScore(true);
                localStorage.setItem(HIGH_SCORE_KEY, score.toString());
            }
            setGameState('finished');
        }
    };

    const handlePlayAgain = () => {
        setGameState('idle');
        setQuestion(null);
        setError(null);
        setScore(0);
        setQuestionCount(0);
        setHintUsed(false);
    };

    const renderGameState = () => {
        if (gameState === 'idle') {
            return (
                <div className="text-center max-w-xl mx-auto">
                    <IconTrophy className="w-24 h-24 text-accent-cyan mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4 text-sea-foam">Ocean Trivia Challenge</h2>
                    <p className="text-slate-gray mb-6">
                        Test your knowledge of the deep blue! Answer {MAX_QUESTIONS} questions and earn points. Use hints if you get stuck!
                    </p>
                    <p className="text-lg font-semibold text-accent-cyan mb-8">High Score: {highScore}</p>
                    <button onClick={handleStartGame} className="px-8 py-4 bg-accent-cyan text-deep-ocean font-bold rounded-lg shadow-lg shadow-cyan-glow transform transition-transform duration-300 hover:scale-105 hover:bg-cyan-400">
                        Start Challenge
                    </button>
                </div>
            );
        }
        
        if (gameState === 'finished') {
            return (
                <div className="text-center max-w-xl mx-auto">
                    <IconTrophy className="w-24 h-24 text-accent-cyan mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-2 text-sea-foam">Challenge Complete!</h2>
                    {isNewHighScore && (
                        <p className="text-xl font-bold text-accent-teal my-3 animate-pulse">New High Score!</p>
                    )}
                    <p className="text-slate-gray mb-2 text-lg">Your Final Score:</p>
                    <p className="text-5xl font-bold text-accent-cyan mb-6">{score}</p>
                     <p className="text-md text-slate-gray mb-8">High Score: {highScore}</p>
                    <button onClick={handlePlayAgain} className="px-8 py-4 bg-accent-cyan text-deep-ocean font-bold rounded-lg shadow-lg shadow-cyan-glow transform transition-transform duration-300 hover:scale-105 hover:bg-cyan-400">
                        Play Again
                    </button>
                </div>
            );
        }


        if (gameState === 'playing') {
            const canUseHint = !hintUsed && !selectedAnswer && score >= HINT_COST;
            return (
                <div className="w-full max-w-3xl flex flex-col flex-grow">
                    {isLoading ? (
                        <div className="flex-grow flex items-center justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400">
                            <p>{error}</p>
                             <button onClick={handlePlayAgain} className="mt-4 px-6 py-2 bg-accent-cyan text-deep-ocean font-bold rounded-lg">
                                Back to Start
                            </button>
                        </div>
                    ) : question && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-semibold text-sea-foam">Question {questionCount}/{MAX_QUESTIONS}</h2>
                                    <button 
                                        onClick={handleUseHint} 
                                        disabled={!canUseHint}
                                        title={`Use Hint (-${HINT_COST} pts)`}
                                        className="flex items-center text-sm px-3 py-1 bg-deep-ocean border border-accent-cyan/30 rounded-full text-accent-cyan hover:bg-accent-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <IconLightbulb className="w-4 h-4 mr-1"/> Hint
                                    </button>
                                </div>
                                <div className="text-lg font-bold text-accent-cyan">Score: {score}</div>
                            </div>
                            <div className="bg-deep-ocean/50 p-6 rounded-lg border border-accent-cyan/20">
                                <p className="text-xl font-semibold mb-4 text-sea-foam">{question.question}</p>
                                {hintUsed && (
                                    <div className="mb-4 p-3 bg-ocean-blue rounded-lg border border-accent-cyan/30 animate-fade-in">
                                        <p className="text-sm text-slate-gray italic"><span className="font-semibold text-accent-cyan not-italic">Hint:</span> {question.hint}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {question.options.map((option, index) => {
                                        const isTheAnswer = selectedAnswer && option === question.answer;
                                        const isSelectedWrong = selectedAnswer && option === selectedAnswer && !isCorrect;
                                        
                                        let buttonClass = 'border-accent-cyan/30 hover:bg-accent-cyan/20';
                                        if (isTheAnswer) buttonClass = 'border-accent-teal bg-accent-teal/20 text-accent-teal';
                                        if (isSelectedWrong) buttonClass = 'border-red-500/70 bg-red-500/20 text-red-400';

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswerSelect(option)}
                                                disabled={!!selectedAnswer}
                                                className={`p-4 text-left font-medium rounded-lg border-2 transition-colors duration-300 flex justify-between items-center ${buttonClass}`}
                                                aria-label={`Select answer: ${option}`}
                                            >
                                                <span>{option}</span>
                                                {isTheAnswer && <IconCheck className="w-5 h-5" />}
                                                {isSelectedWrong && <IconX className="w-5 h-5" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedAnswer && (
                                    <div className="mt-6 p-4 bg-ocean-blue rounded-lg border border-accent-cyan/30 animate-fade-in">
                                        <h4 className="font-bold text-accent-cyan text-lg">{isCorrect ? 'Correct!' : 'Not Quite...'}</h4>
                                        <p className="text-sea-foam mt-2">{question.explanation}</p>
                                    </div>
                                )}
                            </div>
                            {selectedAnswer && (
                                <div className="text-center mt-6">
                                    <button onClick={handleNextQuestion} className="px-8 py-3 bg-accent-cyan text-deep-ocean font-bold rounded-lg shadow-lg shadow-cyan-glow transform transition-transform duration-300 hover:scale-105 hover:bg-cyan-400">
                                        {questionCount < MAX_QUESTIONS ? 'Next Question' : 'Finish Game'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        }
        return null;
    };


    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            {renderGameState()}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default OceanTriviaGame;
