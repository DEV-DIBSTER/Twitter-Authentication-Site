"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Memoize the FloatingPaths component to prevent unnecessary re-renders
const FloatingPaths = memo(({ position }: { position: number }) => {
    // Use useMemo to avoid recalculating paths on every render
    const paths = useMemo(() => {
        // Reduce the number of paths from 36 to 12 for better performance
        return Array.from({ length: 12 }, (_, i) => ({
            id: i,
            d: `M-${380 - i * 15 * position} -${189 + i * 18}C-${
                380 - i * 15 * position
            } -${189 + i * 18} -${312 - i * 15 * position} ${216 - i * 18} ${
                152 - i * 15 * position
            } ${343 - i * 18}C${616 - i * 15 * position} ${470 - i * 18} ${
                684 - i * 15 * position
            } ${875 - i * 18} ${684 - i * 15 * position} ${875 - i * 18}`,
            color: `rgba(15,23,42,${0.1 + i * 0.05})`,
            width: 0.5 + i * 0.1,
        }));
    }, [position]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.05}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            // Reduce animation complexity
                            duration: 30,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
});

FloatingPaths.displayName = "FloatingPaths";

// Memoize the title component to prevent unnecessary re-renders
const AnimatedTitle = memo(({ title }: { title: string }) => {
    const words = title.split(" ");
    
    return (
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            {words.map((word, wordIndex) => (
                <span
                    key={wordIndex}
                    className="inline-block mr-4 last:mr-0"
                >
                    {word.split("").map((letter, letterIndex) => (
                        <motion.span
                            key={`${wordIndex}-${letterIndex}`}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                delay:
                                    wordIndex * 0.1 +
                                    letterIndex * 0.03,
                                type: "spring",
                                stiffness: 150,
                                damping: 25,
                            }}
                            className="inline-block text-transparent bg-clip-text 
                            bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                            dark:from-white dark:to-white/80"
                        >
                            {letter}
                        </motion.span>
                    ))}
                </span>
            ))}
        </h1>
    );
});

AnimatedTitle.displayName = "AnimatedTitle";

// Memoize the action button to prevent unnecessary re-renders
const ActionButton = memo(() => {
    return (
        <div
            className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
            dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
            overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <Button
                variant="ghost"
                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                text-black dark:text-white transition-all duration-300 
                group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                hover:shadow-md dark:hover:shadow-neutral-800/50"
                onClick={() => {
                    window.location.href = "/api/authorize";
                }}
            >
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                    Authorize
                </span>
                <span
                    className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                    transition-all duration-300"
                >
                    →
                </span>
            </Button>
        </div>
    );
});

ActionButton.displayName = "ActionButton";

// Memoize the entire BackgroundPaths component
export const BackgroundPaths = memo(({ title = "Background Paths" }: { title?: string }) => {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <AnimatedTitle title={title} />
                    <ActionButton />
                </motion.div>
            </div>
        </div>
    );
});

BackgroundPaths.displayName = "BackgroundPaths";
