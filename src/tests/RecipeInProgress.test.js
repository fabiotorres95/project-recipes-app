import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import renderWithRouter from './renderWithRouter';
import App from '../App';

describe('Testando Recipe in Progress', () => {
  it('Testando Local Storage', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals/52977');
    });
    await waitFor(() => {
      expect(screen.getByText(/Lentils 1 cup/i));
    });
    const btnStart = screen.getByRole('button', { name: /start recipe/i });
    userEvent.click(btnStart);
    await waitFor(() => {
      expect(screen.getAllByRole('checkbox'));
    });
    expect(screen.getAllByRole('checkbox')[0]).toBeInTheDocument();
  });
  it('Testando com Local Storage e testando Checkboxes', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals/52977');
    });
    await waitFor(() => {
      expect(screen.getByText(/Lentils 1 cup/i));
    });
    localStorage.setItem('inProgressRecipes', JSON
      .stringify({ drinks: {}, meals: {} }));
    const btnStart = screen.getByRole('button', { name: /start recipe/i });
    userEvent.click(btnStart);
    await waitFor(() => {
      expect(screen.getAllByRole('checkbox'));
    });
    const btnFinish = screen.getByRole('button', { name: /finalizar receita/i });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(btnFinish).toBeDisabled();
    userEvent.click(checkboxes[0]);
    userEvent.click(checkboxes[0]);
    checkboxes.forEach((e) => userEvent.click(e));
    expect(checkboxes[0]).toBeChecked();
    expect(btnFinish).not.toBeDisabled();
    userEvent.click(btnFinish);
  });
  it('Testando botão compartilhar', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    await waitFor(() => {
      expect(screen.getByText(/corba/i));
    });
    localStorage.clear();
    const corba = screen.getByText(/corba/i);
    userEvent.click(corba);
    await waitFor(() => {
      expect(screen.getByText(/Lentils 1 cup/i));
    });
    window.document.execCommand = jest.fn(() => true);
    const btnShare = screen.getByRole('button', { name: /compartilhar/i });
    fireEvent.click(btnShare);
    const btnStart = screen.getByRole('button', { name: /start recipe/i });
    userEvent.click(btnStart);
    await waitFor(() => {
      expect(screen.getAllByRole('checkbox'));
    });
    const btnShare2 = screen.getByRole('button', { name: /compartilhar/i });
    fireEvent.click(btnShare2);
  });
});

describe('Testando Recipe in Progress em Drinks', () => {
  // beforeEach(async () => {
  //   const { history } = renderWithRouter(<App />);
  //   act(() => {
  //     history.push('/drinks/17222');
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByText('Gin 1 3/4 shot'));
  //   });
  // });
  it('Testando Local Storage e Button finish', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks/17222');
    });
    await waitFor(() => {
      expect(screen.getByText('Gin 1 3/4 shot'));
    });
    localStorage.setItem('doneRecipes', JSON.stringify([{
      id: '52977',
      type: 'meal',
      nationality: 'Turkish',
      category: 'Side',
      alcoholicOrNot: '',
      tags: [
        'Soup',
      ],
      name: 'Corba',
      doneDate: '2023-04-11T20:49:01.502Z',
      image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
    }]));
    const btnStart = screen.getByRole('button', { name: /start recipe/i });
    userEvent.click(btnStart);
    await waitFor(() => {
      expect(screen.getAllByRole('checkbox'));
    });
    const btnFinish = screen.getByRole('button', { name: /finalizar receita/i });
    expect(btnFinish).toBeDisabled();
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((e) => {
      userEvent.click(e);
      expect(e).toBeChecked();
    });
    expect(btnFinish).not.toBeDisabled();
    userEvent.click(btnFinish);
  });
  it('Testando localStorage caso já tenha a receita', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    localStorage.clear();
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      drinks: {
        17222: [
          'Gin',
          'Grand Marnier',
        ],
      },
      meals: {},
    }));
    await waitFor(() => {
      expect(screen.getByText('A1'));
    });
    const btnA1 = screen.getByText('A1');
    userEvent.click(btnA1);
    await waitFor(() => {
      expect(screen.getByText(/alcoholic/i));
    });
    const btnStart = screen.getByRole('button', { name: /continue recipe/i });
    expect(btnStart).toBeInTheDocument();
  });
  it('Testando checkbox Marcar e Desmarcar', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    localStorage.clear();
    await waitFor(() => {
      expect(screen.getByText('A1'));
    });
    const btnA1 = screen.getByText('A1');
    userEvent.click(btnA1);
    await waitFor(() => {
      expect(screen.getByText(/alcoholic/i));
    });
    const btnFavorite = screen.getByTestId(/favorite-btn/i);
    userEvent.click(btnFavorite);
    userEvent.click(btnFavorite);
    const btnStart = screen.getByRole('button', { name: /start recipe/i });
    userEvent.click(btnStart);
    await waitFor(() => {
      expect(screen.getAllByRole('checkbox'));
    });
    const checkboxes = screen.getAllByRole('checkbox');
    userEvent.click(checkboxes[0]);
    userEvent.click(checkboxes[0]);
  });
  it('testando botao de favoritar caso já esteja favoritado', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    localStorage.clear();
    localStorage.setItem('favoriteRecipes', JSON.stringify([[
      {
        id: '17222',
        type: 'drink',
        nationality: '',
        category: 'Cocktail',
        alcoholicOrNot: 'Alcoholic',
        name: 'A1',
        image: 'https://www.thecocktaildb.com/images/media/drink/2x8thr1504816928.jpg',
      },
    ]]));
    await waitFor(() => {
      expect(screen.getByText('A1'));
    });
    const btnA1 = screen.getByText('A1');
    userEvent.click(btnA1);
    await waitFor(() => {
      expect(screen.getByText(/alcoholic/i));
    });
    const btnFavorite = screen.getByTestId('favorite-btn');
    userEvent.click(btnFavorite);
    userEvent.click(btnFavorite);
  });
  it('testando botao de favoritar caso já esteja favoritado no meals', async () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    localStorage.clear();
    localStorage.setItem('favoriteRecipes', JSON.stringify([[
      [
        {
          id: '52977',
          type: 'meal',
          nationality: 'Turkish',
          category: 'Side',
          alcoholicOrNot: '',
          name: 'Corba',
          image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
        },
      ],
    ]]));
    await waitFor(() => {
      expect(screen.getByText(/corba/i));
    });
    const btnCorba = screen.getByText(/corba/i);
    userEvent.click(btnCorba);
    await waitFor(() => {
      expect(screen.getByText(/Ingredientes/i));
    });
    const btnFavorite = screen.getByTestId('favorite-btn');
    userEvent.click(btnFavorite);
    userEvent.click(btnFavorite);
  });
});
