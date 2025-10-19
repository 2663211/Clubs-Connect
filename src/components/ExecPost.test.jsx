import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExecPost from './ExecPost';
import { supabase } from '../supabaseClient';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));

// Mock supabase
jest.mock('../supabaseClient');

describe('Exec Post', () => {
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
      caption: 'First post caption',
      media_url: 'https://example.com/image1.jpg',
      media_type: 'image',
      member_only: false,
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    }];
  const mockUserId = '1234';
  const member = true;

beforeEach(()=>{
     jest.clearAllMocks();
});

test('basic truthy test', () => {
  expect(true).toBe(true);
});
test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <ExecPost />
    </BrowserRouter>
  );
});
test('Caption recorded when created', ()=>{
  render(
    <BrowserRouter>
      <ExecPost />
    </BrowserRouter>
  );
const caption = "test";
const file = '/robotics.png';
const submit_button = screen.getByPlaceholderText(/create a post/i);
fireEvent.change(submit_button,{target: {value: caption}});
expect(submit_button.value).toBe(caption);
});
test('file recorded when created', ()=>{
  render(
    <BrowserRouter>
      <ExecPost />
    </BrowserRouter>
  );

const file = '/robotics.png';
const file_button = screen.getByAltText(/attach/i);
expect(file_button).toBeInTheDocument();
});

});
