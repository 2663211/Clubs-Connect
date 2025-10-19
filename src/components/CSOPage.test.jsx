import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EntityPage from './CSOPage';
import { supabase } from '../supabaseClient';
// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));

// Mock supabase
jest.mock('../supabaseClient');

describe('CSO page', () => {
  const mockCSOs = [
    { id: 1, name: 'Drama Club', cluster: 'Arts', logo_url: '/drama.png' },
    { id: 2, name: 'Robotics Society', cluster: 'STEM', logo_url: '/robotics.png' },
  ];
  const mockMemberships = [
    { id: 1, name: 'Drama Club', cluster: 'Arts', logo_url: '/drama.png',student_number: '1234' },
    { id: 2, name: 'Robotics Society', cluster: 'STEM', logo_url: '/robotics.png', student_number: '1235' }
  ];
  const mockPosts = [
     {
      id: 1,
      cso_id: 1,
      caption: 'Mukondi caption',
      media_url: 'https://example.com/image1.jpg',
      media_type: 'image',
      member_only: false,
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: 2,
      cso_id:1,
      caption: 'Second post',
      media_url: 'https://example.com/audio.mp3',
      media_type: 'audio',
      member_only: true,
      created_at: new Date(Date.now() - 3600000*2).toISOString(), 
    }
  ];

  const mockUserId = '1234';

beforeEach(()=>{
     jest.clearAllMocks();
});

test('basic truthy test', () => {
  expect(true).toBe(true);
});
test('renders without crashing', () => {
  render(
     <BrowserRouter>
         <EntityPage />
       </BrowserRouter>
  );
});
test('render back button', ()=>{
  render(
     <BrowserRouter>
         <EntityPage />
       </BrowserRouter>
  );
  const backButton = screen.getByAltText(/Back/i);
  expect(backButton).toBeInTheDocument();
});

});
