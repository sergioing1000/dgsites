import { fireEvent, render, screen } from '@testing-library/react';
import CarouselSelector from './carouselselector.jsx';

vi.mock('./singlesite1.jsx', () => ({
  default: () => <div>Single site module</div>,
}));
vi.mock('./exceluploadtable1.jsx', () => ({
  default: () => <div>Multiple site module</div>,
}));
vi.mock('./currentlocation1.jsx', () => ({
  default: () => <div>Current location module</div>,
}));
vi.mock('./docs.jsx', () => ({
  default: () => <div>Documentation module</div>,
}));

beforeEach(() => {
  global.Audio = vi.fn(function AudioMock() {
    this.currentTime = 0;
    this.play = vi.fn().mockResolvedValue(undefined);
  });
});

test('shows the available consultation options', () => {
  render(<CarouselSelector />);

  expect(screen.getByText('Single Site')).toBeInTheDocument();
  expect(screen.getByText('Multiple Site')).toBeInTheDocument();
  expect(screen.getByText('Current Location')).toBeInTheDocument();
  expect(screen.getByText('Documentation')).toBeInTheDocument();
});

test('shows the module selected by the user', () => {
  render(<CarouselSelector />);

  fireEvent.click(screen.getByText('Documentation'));

  expect(screen.getByText('Documentation module')).toBeInTheDocument();
});
