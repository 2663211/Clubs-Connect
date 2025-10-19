import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExecPost from './ExecPost';
import { supabase } from '../supabaseClient';

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <div>Test</div>
    </BrowserRouter>
  );
});