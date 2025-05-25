import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useAnimationSettings } from '../../context/AnimationContext';
import FadeIn from '../../src/components/basic/FadeIn';

// Mock external dependencies
jest.mock('@gsap/react', () => ({
  useGSAP: jest.fn()
}));
jest.mock('gsap', () => ({
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn()
}));
jest.mock('gsap/ScrollTrigger', () => ({
  create: jest.fn(),
  getAll: jest.fn(() => []),
  kill: jest.fn()
}));
jest.mock('../../context/AnimationContext', () => ({
  useAnimationSettings: jest.fn()
}));

describe('FadeIn Component', () => {
  let mockContextSafe;
  
  beforeEach(() => {
    mockContextSafe = jest.fn(fn => fn);
    useGSAP.mockReturnValue({ contextSafe: mockContextSafe });
    useAnimationSettings.mockReturnValue({
      disableAllAnimations: false,
      disableScrollAnimations: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders children correctly', () => {
    render(Test Content);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies default className and style', () => {
    render(Test Content);
    const element = screen.getByText('Test Content').parentElement;
    expect(element).toHaveClass('react-gsap-fadein');
    expect(element).toHaveStyle({});
  });

  test('applies custom className and style', () => {
    render(Test Content);
    const element = screen.getByText('Test Content').parentElement;
    expect(element).toHaveClass('react-gsap-fadein custom-class');
    expect(element).toHaveStyle({ color: 'red' });
  });

  test('calls gsap.from with correct parameters on load trigger', () => {
    render(Test Content);
    expect(gsap.from).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0,
      ease: 'power3.out'
    }));
  });

  test('does not call gsap.from when animations are disabled', () => {
    useAnimationSettings.mockReturnValue({
      disableAllAnimations: true,
      disableScrollAnimations: false
    });
    render(Test Content);
    expect(gsap.from).not.toHaveBeenCalled();
  });

  test('calls ScrollTrigger.create on scroll trigger', () => {
    render(Test Content);
    expect(ScrollTrigger.create).toHaveBeenCalledWith(expect.objectContaining({
      trigger: expect.anything(),
      start: 'top bottom-=20%',
      onEnter: expect.any(Function)
    }));
  });

  test('does not call ScrollTrigger.create when scroll animations are disabled', () => {
    useAnimationSettings.mockReturnValue({
      disableAllAnimations: false,
      disableScrollAnimations: true
    });
    render(Test Content);
    expect(ScrollTrigger.create).not.toHaveBeenCalled();
  });

  test('plays animation on hover trigger', () => {
    render(Test Content);
    const element = screen.getByText('Test Content').parentElement;
    fireEvent.mouseEnter(element);
    expect(gsap.fromTo).toHaveBeenCalled();
  });

  test('plays animation on click trigger', () => {
    render(Test Content);
    const element = screen.getByText('Test Content').parentElement;
    fireEvent.click(element);
    expect(gsap.fromTo).toHaveBeenCalled();
  });

  test('calls onStart and onComplete callbacks', () => {
    const onStart = jest.fn();
    const onComplete = jest.fn();
    render(Test Content);
    expect(gsap.from).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      onStart,
      onComplete
    }));
  });

  test('renders children as a function with play method', () => {
    const children = jest.fn();
    render({children});
    expect(children).toHaveBeenCalledWith(expect.objectContaining({
      play: expect.any(Function)
    }));
  });
});