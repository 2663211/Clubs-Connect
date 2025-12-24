import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import Auth from './Auth';
import { supabase } from '../supabaseClient.js';

afterEach(() => {
  cleanup();
});

test('basic truthy test', () => {
  expect(true).toBe(true);
});

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <div>Test</div>
    </BrowserRouter>
  );
});

test('renders Clubs Connect header', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

  const headerElement = await screen.findByText(/Clubs Connect/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders Login view', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  expect(await screen.findByText(/Login/i)).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
});

test('renders Login legend', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

  const legendElement = await screen.findByText(/Login/i);
  expect(legendElement.tagName).toBe('LEGEND');
  expect(legendElement).toBeInTheDocument();
});

test('renders Sign in with Google button', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

  const googleButton = await screen.findByRole('button', { name: /Sign in with Google/i });
  expect(googleButton).toBeInTheDocument();
});

test('calls Google sign in', async () => {
  const { supabase } = require('../supabaseClient.js');
  supabase.auth.signInWithOAuth = jest.fn().mockResolvedValue({ error: null });

  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const googleButton = await screen.findByRole('button', { name: /Sign in with Google/i });
  fireEvent.click(googleButton);

  expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
});

test('renders Dont have an account button', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

  const googleButton = await screen.findByRole('button', { name: /Don't have an account/i });
  expect(googleButton).toBeInTheDocument();
});

test('renders Wits Google Account instruction text', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

  const instructionText = await screen.findByText(/Use your Wits Google Account to Sign in/i);
  expect(instructionText).toBeInTheDocument();
});

test('renders Signup view after toggling', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

  const toggleButton = await screen.findByRole('button', { name: /Sign up here/i });
  fireEvent.click(toggleButton);
  expect(await screen.findByText(/Signup/i)).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: /Sign up with Google/i })).toBeInTheDocument();
});

test('renders Signup legend', async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/', state: { form: 'signup' } }]}>
      <Auth />
    </MemoryRouter>
  );

  const legendElement = await screen.findByText(/Signup/i);
  expect(legendElement.tagName).toBe('LEGEND');
  expect(legendElement).toBeInTheDocument();
});

test('renders Sign up with Google button', async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/', state: { form: 'signup' } }]}>
      <Auth />
    </MemoryRouter>
  );

  const googleButton = await screen.findByRole('button', { name: /Sign up with Google/i });
  expect(googleButton).toBeInTheDocument();
});
test('calls Google sign up', async () => {
  const { supabase } = require('../supabaseClient.js');
  supabase.auth.signInWithOAuth = jest.fn().mockResolvedValue({ error: null });

  render(
    <MemoryRouter initialEntries={[{ pathname: '/', state: { form: 'signup' } }]}>
      <Auth />
    </MemoryRouter>
  );
  const googleButton = await screen.findByRole('button', { name: /Sign up with Google/i });
  fireEvent.click(googleButton);

  expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
});

test('renders already have an account button', async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/', state: { form: 'signup' } }]}>
      <Auth />
    </MemoryRouter>
  );

  const googleButton = await screen.findByRole('button', { name: /Already have an account/i });
  expect(googleButton).toBeInTheDocument();
});

test('renders Wits Google Account instruction', async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/', state: { form: 'signup' } }]}>
      <Auth />
    </MemoryRouter>
  );

  const instructionText = await screen.findByText(/Use your Wits Google Account to Sign up/i);
  expect(instructionText).toBeInTheDocument();
});

test('toggles back to Login view', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

  const toggleToSignup = await screen.findByRole('button', { name: /Sign up here/i });
  fireEvent.click(toggleToSignup);

  const toggleToLogin = await screen.findByRole('button', { name: /Login here/i });
  fireEvent.click(toggleToLogin);

  expect(await screen.findByText(/Login/i)).toBeInTheDocument();
});
