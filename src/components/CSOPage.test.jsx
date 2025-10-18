import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EntityPage from './CSOPage';
import { supabase } from '../supabaseClient';

test('renders without crashing', () => {
  render(
     <BrowserRouter>
         <EntityPage />
       </BrowserRouter>
  );
});
