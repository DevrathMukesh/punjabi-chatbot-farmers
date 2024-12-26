import React, { useState } from 'react';
import './PunjabiKeyboard.css';

const PunjabiKeyboard = ({ onInput }) => {
    const consonants = [
        'ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਙ',
        'ਚ', 'ਛ', 'ਜ', 'ਝ', 'ਞ',
        'ਟ', 'ਠ', 'ਡ', 'ਢ', 'ਣ',
        'ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ',
        'ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ',
        'ਯ', 'ਰ', 'ਲ', 'ਵ', 'ੜ',
        'ਸ਼', 'ਸ', 'ਹ',
    ];

    const vowels = ['ਅ', 'ਆ', 'ਇ', 'ਈ', 'ਉ', 'ਊ', 'ਏ', 'ਐ', 'ਓ', 'ਔ'];
    const matras = ['ਾ', 'ਿ', 'ੀ', 'ੁ', 'ੂ', 'ੇ', 'ੈ', 'ੋ', 'ੌ'];
    const others = ['ਂ', 'ੰ', '਼'];

    const [currentConsonant, setCurrentConsonant] = useState('');
    const [currentWord, setCurrentWord] = useState('');

    const handleClick = (char) => {
        if (consonants.includes(char)) {
            setCurrentConsonant(char);
            setCurrentWord(prevWord => prevWord + char);
            onInput(currentWord + char);
        } else if (matras.includes(char)) {
            if (currentConsonant) {
                const combinedChar = currentConsonant + char;
                setCurrentWord(prevWord => prevWord.slice(0, -1) + combinedChar);
                onInput(currentWord.slice(0, -1) + combinedChar);
                setCurrentConsonant('');
            } else {
                console.log("Matra pressed without a consonant.");
            }
        } else {
            setCurrentConsonant('');
            setCurrentWord(prevWord => prevWord + char);
            onInput(currentWord + char);
        }
    };

    const handleBackspace = () => {
        if (currentWord.length > 0) {
            if (matras.includes(currentWord.slice(-1))) {
                setCurrentWord(prevWord => prevWord.slice(0, -2));
                onInput(currentWord.slice(0, -2));
            } else {
                setCurrentWord(prevWord => prevWord.slice(0, -1));
                onInput(currentWord.slice(0, -1));
            }
            setCurrentConsonant('');
        }
    };

    const handleSpace = () => {
        handleClick(" ");
    };

    return (
        <div className="punjabi-keyboard">
            <div className="keyboard-row">
                {consonants.map((char) => (
                    <button key={char} onClick={() => handleClick(char)}>
                        {char}
                    </button>
                ))}
            </div>
            <div className="keyboard-row">
                {vowels.map((char) => (
                    <button key={char} onClick={() => handleClick(char)}>
                        {char}
                    </button>
                ))}
            </div>
            <div className="keyboard-row">
                {matras.map((char) => (
                    <button key={char} onClick={() => handleClick(char)}>
                        {char}
                    </button>
                ))}
            </div>
            <div className="keyboard-row">
                {others.map((char) => (
                    <button key={char} onClick={() => handleClick(char)}>
                        {char}
                    </button>
                ))}
                <button onClick={handleSpace}>Space</button>
                <button onClick={handleBackspace}>⌫</button>
            </div>
        </div>
    );
};

export default PunjabiKeyboard;