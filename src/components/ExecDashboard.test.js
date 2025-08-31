import { BrowserRouter } from 'react-router-dom';
import{render, screen, cleanup,fireEvent, waitFor} from '@testing-library/react';

// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
import ExecDashboard from './ExecDashboard.js';

// const server = setupServer(
//   rest.get('/api/data', (req, res, ctx) => {
//     return res(ctx.json({ data: 'Mocked Data' }));
//   })
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// test('renders API data', async () => {
//    render(<BrowserRouter><ExecDashboard/></BrowserRouter>);
//   await waitFor(() => expect(screen.getByText('Mocked Data')).toBeInTheDocument());
// });
afterEach(()=>{
    cleanup();
});

test('test', ()=>{
    expect(true).toBe(true);
});
test('renders without crashing', ()=>{
    render(<BrowserRouter><div>Test</div></BrowserRouter>);
});

test("welcome message should be rendered", ()=>{
    render(<BrowserRouter><ExecDashboard/></BrowserRouter>);
    const cso_list = screen.getByTestId('welcome');
    expect(cso_list).toBeInTheDocument()
});

test("cso_list should be rendered", ()=>{
    render(<BrowserRouter><ExecDashboard/></BrowserRouter>);
    const cso_list = screen.getByTestId('cso-list');
    expect(cso_list).toBeInTheDocument()
});

test("number of cso's listed should match", ()=>{
  render(<BrowserRouter><ExecDashboard/></BrowserRouter>);
  const testList = ["foo","yoo"];
   const csos = screen.getByTestId('cso-list');
    fireEvent.change(csos, {target:{value:testList}});
    expect(csos.value).toBe(testList);
});