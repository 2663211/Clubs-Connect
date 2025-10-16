import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import SGODashboard from './CSO.js';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));
beforeEach(()=>{
     jest.clearAllMocks();
});
afterEach(() => {
  cleanup();
});

// test('basic truthy test', () => {
//   expect(true).toBe(true);
// });
// test('renders without crashing', () => {
//   render(
//     <BrowserRouter>
//       <div>Test</div>
//     </BrowserRouter>
//   );
// });
test('Heading input should be rendered', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const heading = screen.getByText(/Clubs, Societies, and Organizations/i);
  expect(heading).toBeInTheDocument();
});
test('Paragraph input should be rendered', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const heading = screen.getByText(/Modify, add, and delete CSOs./i);
  expect(heading).toBeInTheDocument();
});
test('Add CSO button input should be rendered', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const buttonInputEl = screen.getByText(/Add CSO/i);
  expect(buttonInputEl).toBeInTheDocument();
});
test('Back button input should be rendered', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
 const buttonInputEl = screen.getByText(/Back/i);
  expect(buttonInputEl).toBeInTheDocument();
});
test('Navigates to Add CSO', async ()=>{
    render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
        const AddCso = await screen.findByText(/Add CSO/i);
        fireEvent.click(AddCso);
    
        expect(mockedNavigate).toHaveBeenCalledWith('/addCSO');
});
test('Navigates to SGO', async ()=>{
    render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
        const BackButton = await screen.findByText(/Back/i);
        fireEvent.click(BackButton);
    
        expect(mockedNavigate).toHaveBeenCalledWith('/SGO');
});