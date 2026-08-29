import { fireEvent, render, screen } from '@testing-library/react';
import CarouselSelector from './carouselselector.jsx';

vi.mock('./singlesite1.jsx', () => ({
  default: ({ initialCoordinates }) => (
    <div>
      Single site module
      {initialCoordinates && (
        <span>{initialCoordinates.latitude}, {initialCoordinates.longitude}</span>
      )}
    </div>
  ),
}));
vi.mock('./exceluploadtable1.jsx', () => ({
  default: () => <div>Multiple site module</div>,
}));
vi.mock('./currentlocation1.jsx', () => ({
  default: ({ onUseLocation }) => (
    <button
      onClick={() => onUseLocation({ latitude: '4.609700', longitude: '-74.081700' })}
    >
      Current location module
    </button>
  ),
}));
vi.mock('./docs.jsx', () => ({
  default: () => <div>Documentation module</div>,
}));

beforeEach(() => {
  globalThis.Audio = vi.fn(function AudioMock() {
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

test('shows the module selected by the user', async () => {
  render(<CarouselSelector />);

  fireEvent.click(screen.getByText('Documentation'));

  expect(await screen.findByText('Documentation module')).toBeInTheDocument();
});

test('sends detected coordinates into the single-site workflow', async () => {
  render(<CarouselSelector />);

  fireEvent.click(screen.getByText('Current Location'));
  fireEvent.click(await screen.findByText('Current location module'));

  expect(await screen.findByText('4.609700, -74.081700')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /single site/i })).toHaveAttribute(
    'aria-current',
    'page'
  );
});
