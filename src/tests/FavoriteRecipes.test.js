import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import Routes from '../pages/Routes';
import AppProvider from '../context/AppProvider';

describe('Testando a página de receitas favoritas', () => {
  const favoriteRecipes = [
    {
      id: '52771',
      type: 'meal',
      nationality: 'Italian',
      category: 'Vegetarian',
      alcoholicOrNot: '',
      name: 'Spicy Arrabiata Penne',
      image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    },
    {
      id: '178319',
      type: 'drink',
      nationality: '',
      category: 'Cocktail',
      alcoholicOrNot: 'Alcoholic',
      name: 'Aquamarine',
      image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
    },
  ];

  beforeEach(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));

    const { history } = renderWithRouter(<AppProvider><Routes /></AppProvider>);
    act(() => {
      history.push('/favorite-recipes');
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('testa se as imagens aparecem na tela, e mandam para a tela de detalhes', () => {
    // const { history } = renderWithRouter(<AppProvider><Routes /></AppProvider>);
    // act(() => {
    //   history.push('/favorite-recipes');
    // });

    const picture0 = screen.getByTestId('0-horizontal-image');
    const picture1 = screen.getByTestId('1-horizontal-image');

    expect(picture0).toBeInTheDocument();
    expect(picture1).toBeInTheDocument();

    userEvent.click(picture0);
    waitFor(() => {
      expect(window.location.pathname).toBe('/meals/52771');
    });
  });

  it('testa se o botão de filtro "meals" e "drinks" funciona', () => {
    const meal = screen.getByTestId('0-horizontal-name');
    const drink = screen.getByTestId('1-horizontal-name');

    const mealFilter = screen.getByTestId('filter-by-meal-btn');
    const drinkFilter = screen.getByTestId('filter-by-drink-btn');

    userEvent.click(mealFilter);
    waitFor(() => {
      expect(meal).toBeInTheDocument();
      expect(drink).not.toBeInTheDocument();
    });

    userEvent.click(drinkFilter);
    waitFor(() => {
      expect(meal).not.toBeInTheDocument();
      expect(drink).toBeInTheDocument();
    });
  });
});
