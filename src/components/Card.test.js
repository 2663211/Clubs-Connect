import { render, screen, cleanup } from '@testing-library/react';
import Card from './Card';

afterEach(() => {
  cleanup();
});

describe('Card Component', () => {
  const mockProps = {
    image: 'test-image.jpg',
    description: 'This is a test description',
  };

  test('renders card image', () => {
    render(<Card {...mockProps} />);
    const imageElement = screen.getByAltText(/image describing content under/i);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockProps.image);
  });

  test('renders card description', () => {
    render(<Card {...mockProps} />);
    const descriptionElement = screen.getByText(/This is a test description/i);
    expect(descriptionElement).toBeInTheDocument();
  });
});
