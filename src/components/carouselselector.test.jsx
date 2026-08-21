import { fireEvent, render, screen } from '@testing-library/react';
import CarouselSelector from './carouselselector.jsx';

jest.mock('./singlesite1.jsx', () => () => <div>Single site module</div>);
jest.mock('./exceluploadtable1.jsx', () => () => <div>Multiple site module</div>);
jest.mock('./currentlocation1.jsx', () => () => <div>Current location module</div>);
jest.mock('./docs.jsx', () => () => <div>Documentation module</div>);

beforeEach(() => {
  global.Audio = jest.fn(() => ({
    currentTime: 0,
    play: jest.fn().mockResolvedValue(undefined),
  }));
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
