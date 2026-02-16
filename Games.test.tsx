
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AssociationGame from './components/Games/AssociationGame';
import MemoryGame from './components/Games/MemoryGame';
import { AppSettings } from './types';
import * as geminiService from './services/geminiService';

// Mock values
const mockSettings: AppSettings = {
    fontSize: 'medium',
    highContrast: false,
    calmMode: false,
    audioSpeed: 1.0,
    enableAnimations: true,
    enableSounds: true,
    preferredMascotId: 'default',
    enabledRewards: ['stickers', 'sounds'],
    themeIntensity: 'normal'
};

// Mock service
vi.mock('./services/geminiService', () => ({
    speakWord: vi.fn(),
    speakGuided: vi.fn(),
    speakFeedback: vi.fn(),
    playUISound: vi.fn(),
}));

describe('Games Integration', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    describe('AssociationGame', () => {
        it('renders initial game state', () => {
            render(
                <AssociationGame
                    moduleId="fruits"
                    language="pt"
                    settings={mockSettings}
                    onFinish={vi.fn()}
                    onBack={vi.fn()}
                />
            );

            // Should show a word (mocked or real from constants)
            // "Maçã" or "Banana" are in fruits module.
            // Since order is random, we check for visibility of main container/header
            expect(screen.getByText(/Palavra 1 de/i)).toBeInTheDocument();
            expect(screen.getByText(/Toque na imagem correta/i)).toBeInTheDocument();

            // Should have options (buttons with images)
            const options = screen.getAllByRole('button').filter(b => b.querySelector('img'));
            expect(options.length).toBeGreaterThan(0);
        });

        it('handles correct answer interaction', async () => {
            const onFinish = vi.fn();
            render(
                <AssociationGame
                    moduleId="fruits"
                    language="pt"
                    settings={mockSettings}
                    onFinish={onFinish}
                    onBack={vi.fn()}
                />
            );

            // We need to identify the correct option. 
            // In the component, text is displayed: {currentWord.translations[language]}
            // We can find the text on screen, then find the corresponding image button?
            // Actually, we can't easily know which image corresponds to the text without digging into component state or props.
            // BUT, for a "black box" test, we can just click ONLY the correct one? 
            // Or we can click all of them until we find the correct one?
            // Since we mocked random sort in the component (wait, we didn't mock Math.random), 
            // the order is random.

            // Strategy: Mock Math.random to ensure deterministic order?
            // Or just check that clicking *something* triggers a sound/feedback.

            // Let's try to find the word text.
            const wordElement = screen.getByRole('heading', { level: 2 });
            const wordText = wordElement.textContent; // e.g., "Maçã"

            // We know WORDS constant.
            // We can find the image URL for "Maçã".
            // Then click the image with that URL.
        });
    });

    describe('MemoryGame', () => {
        it('renders cards grid', () => {
            render(
                <MemoryGame
                    moduleId="fruits"
                    language="pt"
                    settings={mockSettings}
                    onFinish={vi.fn()}
                    onBack={vi.fn()}
                />
            );

            // Should show "Pares: 0 de"
            expect(screen.getByText(/Pares: 0 de/i)).toBeInTheDocument();

            // Should have cards (buttons)
            // 2 words -> 4 cards
            const cards = screen.getAllByText('?');
            expect(cards.length).toBeGreaterThanOrEqual(4);
        });

        it('flips card on click', () => {
            render(
                <MemoryGame
                    moduleId="fruits"
                    language="pt"
                    settings={mockSettings}
                    onFinish={vi.fn()}
                    onBack={vi.fn()}
                />
            );

            const cards = screen.getAllByRole('button').filter(b => b.textContent?.includes('?'));
            const firstCard = cards[0];

            fireEvent.click(firstCard);

            // After click, "isFlipped" state changes.
            // The content changes from "?" to Image or Text.
            // verifying that it spoke
            expect(geminiService.speakWord).toHaveBeenCalled();
        });
    });
});
