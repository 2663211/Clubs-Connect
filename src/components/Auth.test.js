import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import Auth from './Auth.js';
//import { supabase } from '../supabaseClient.js';

// jest.mock('supabase.auth', ()=>({

//     __esModule:true,

//     default:{
//         signInWithPassword: ()=> ({
//         data:{user:1, name:"John"}
//         })
//     }
// }));

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
test('userEmail input should be rendered', () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const emailInputEl = screen.getByPlaceholderText(/12345@students.wits.ac.za/i);
  expect(emailInputEl).toBeInTheDocument();
});
test('userFullName input should be rendered', () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const nameInputEl = screen.getByTestId('Full-name');
  expect(nameInputEl).toBeInTheDocument();
});
test('password input should be rendered', () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const passwordInputEl = screen.getByLabelText(/password/i);
  expect(passwordInputEl).toBeInTheDocument();
});
test('button input should be rendered', () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const buttonInputEl = screen.getByTestId('Login-button');
  expect(buttonInputEl).toBeInTheDocument();
});

test('SignUp button input should be rendered', async () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const someButton = screen.getByTestId('SignUp-button');
  fireEvent.click(someButton);
  await waitFor(() => {
    expect(someButton).toBeInTheDocument(); // Only assertions in waitFor
  });
  expect(someButton).toBeInTheDocument();
});
test('userEmail input should change', () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const emailInputEl = screen.getByPlaceholderText(/12345@students.wits.ac.za/i);
  const testValue = 'test';

  fireEvent.change(emailInputEl, { target: { value: testValue } });
  expect(emailInputEl.value).toBe(testValue);
});
test('password input should change', () => {
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );
  const passwordInputEl = screen.getByLabelText(/password/i);

  const testValue = 'test';

  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  expect(passwordInputEl.value).toBe(testValue);
});
// test("log in after fetching", async ()=>{
//     render(<BrowserRouter><Auth/></BrowserRouter>);
//      const buttonInputEl = screen.getByTestId('Login-button');
//      const emailInputEl = screen.getByPlaceholderText(/12345@students.wits.ac.za/i);
//     const passwordInputEl = screen.getByLabelText(/password/i);

//     const testValue = "test";

//     fireEvent.change(passwordInputEl, {target:{value:testValue}});
//     fireEvent.change(emailInputEl, {target:{value:testValue}});
//     fireEvent.click(buttonInputEl);
//     await waitFor(()=>
//     expect(buttonInputEl).toBe(testValue)
// );
// });
