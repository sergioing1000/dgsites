import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/carouselselector.jsx', () => () => (
  <div data-testid="carousel-selector" />
));

test('renders the application header and main selector', () => {
  render(<App />);

  expect(
    screen.getByRole('link', { name: /solar app by sergio cruz/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: /nasa power logo/i })
  ).toBeInTheDocument();
  expect(screen.getByTestId('carousel-selector')).toBeInTheDocument();
});
