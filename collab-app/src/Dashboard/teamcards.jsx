/**
 * @file TeamCards.jsx
 * @description 
 * A visually engaging React component that displays a set of interactive team-themed cards.
 * Each card expands on hover and reveals additional descriptive text with smooth transitions.
 * 
 * The component uses TailwindCSS utility classes for styling, Google Fonts for typography,
 * and responsive flexbox layout to create an appealing gallery section.
 * 
 * @author Pranav Singh
 */

import React from "react";

/**
 * @function TeamCards
 * @description 
 * Renders a three-card interactive gallery showcasing different professional roles.
 * Each card expands when hovered and displays an overlay consisting of a title and description.
 * 
 * The component injects a `<style>` tag to apply the Poppins font globally to all elements
 * rendered within this component. It also structures the UI using flexbox and TailwindCSS classes.
 * 
 * @returns {JSX.Element} A fully styled section containing interactive hover-expand cards.
 */
export default function TeamCards() {
    return (
        <>
            {/* ------------------------- FONT IMPORT SECTION ------------------------- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

            {/* ---------------------------- HEADER SECTION ---------------------------- */}
            <h1 className="text-3xl font-semibold text-center mx-auto">Our Latest Creations</h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
                A visual collection of our most recent works — each piece crafted with intention, 
                emotion, and style.
            </p>

            {/* ---------------------------- CARD CONTAINER ---------------------------- */}
            <div className="flex items-center gap-6 h-[400px] w-full max-w-5xl mt-10 mx-auto">

                {/* ---------------------------- CARD 1 ---------------------------- */}
                <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
                    <img
                        className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=800&h=400&auto=format&fit=crop"
                        alt="image"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h1 className="text-3xl">Prompt engineers</h1>
                        <p className="text-sm">
                            Bridging the gap between human intent and machine understanding through expert prompt design.
                        </p>
                    </div>
                </div>

                {/* ---------------------------- CARD 2 ---------------------------- */}
                <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
                    <img
                        className="h-full w-full object-cover object-right"
                        src="https://images.unsplash.com/photo-1714976326351-0ecf0244f0fc?q=80&w=800&h=400&auto=format&fit=crop"
                        alt="image"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h1 className="text-3xl">Data scientists</h1>
                        <p className="text-sm">
                            Bridging the gap between human intent and machine understanding through expert prompt design.
                        </p>
                    </div>
                </div>

                {/* ---------------------------- CARD 3 ---------------------------- */}
                <div className="relative group flex-grow transition-all w-56 h-[400px] duration-500 hover:w-full">
                    <img
                        className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1736220690062-79e12ca75262?q=80&w=800&h=400&auto=format&fit=crop"
                        alt="image"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h1 className="text-3xl">Software engineers</h1>
                        <p className="text-sm">
                            Bridging the gap between human intent and machine understanding through expert prompt design.
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}