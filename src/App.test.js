import { render, screen } from '@testing-library/react';
import App from './App';
import React from "react";

describe('App', () =>{
    it('must render a tittle', () =>{
        render(<App/>)
        expect(screen.queryByText(/productos/i)).toBeInTheDocument();
    })
})