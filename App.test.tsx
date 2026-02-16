
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Integration', () => {
    it('renders landing page initially', () => {
        render(<App />);
        expect(screen.getByText(/Olá, explorador!/i)).toBeInTheDocument();
        expect(screen.getByText(/Começar Agora/i)).toBeInTheDocument();
        expect(screen.getByText(/Área dos Pais e Professores/i)).toBeInTheDocument();
    });

    it('navigates to Language Selector when "Começar Agora" is clicked', () => {
        render(<App />);
        fireEvent.click(screen.getByText(/Começar Agora/i));
        expect(screen.getByText(/Para onde vamos agora\?/i)).toBeInTheDocument();
        expect(screen.getByText(/Escolha um mundo para explorar/i)).toBeInTheDocument();
    });

    it('navigates to Parent Dashboard when "Área dos Pais" is clicked', () => {
        render(<App />);
        fireEvent.click(screen.getByText(/Área dos Pais e Professores/i));
        expect(screen.getByText(/Progresso/i)).toBeInTheDocument();
    });

    it('selects language and navigates to Dashboard', () => {
        render(<App />);
        // Navigate to Language Selector
        fireEvent.click(screen.getByText(/Começar Agora/i));

        // Select Portuguese
        const portugueseBtn = screen.getByText(/Português/i);
        fireEvent.click(portugueseBtn);

        // Verify Dashboard
        expect(screen.getByText(/Caminho do Português/i)).toBeInTheDocument();
    });

    it('navigates to Settings from Dashboard', () => {
        render(<App />);
        // Navigate to Dashboard
        fireEvent.click(screen.getByText(/Começar Agora/i));
        fireEvent.click(screen.getByText(/Português/i));

        // Open Settings (Settings icon usually has an accessible name or title, but here it's an emoji inside a button)
        // The dashboard has a button with '⚙️'. We can find by text '⚙️' or query selector if we add test id.
        // Dashboard.tsx: <button onClick={onSettings} ... >⚙️</button>

        const settingsBtn = screen.getByText('⚙️');
        fireEvent.click(settingsBtn);

        expect(screen.getByText(/Configurações para Pais/i)).toBeInTheDocument();
    });
});
