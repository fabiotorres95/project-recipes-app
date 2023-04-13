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

  const mealNameTestId = '0-horizontal-name';
  const drinkNameTestId = '1-horizontal-name';
  const mealFilterTestId = 'filter-by-meal-btn';

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
    const picture0 = screen.getByTestId('0-horizontal-image');
    const picture1 = screen.getByTestId('1-horizontal-image');

    expect(picture0).toBeInTheDocument();
    expect(picture1).toBeInTheDocument();

    userEvent.click(picture0);
    waitFor(() => {
      expect(window.location.pathname).toBe('/meals/52771');
    });
  });

  it('testa se os botões de filtro "meals", "drinks" e "All" funcionam', () => {
    const meal = screen.getByTestId(mealNameTestId);
    const drink = screen.getByTestId(drinkNameTestId);

    const mealFilter = screen.getByTestId(mealFilterTestId);
    const drinkFilter = screen.getByTestId('filter-by-drink-btn');
    const AllFilter = screen.getByTestId('filter-by-all-btn');

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

    userEvent.click(AllFilter);
    waitFor(() => {
      expect(meal).toBeInTheDocument();
      expect(drink).toBeInTheDocument();
    });
  });

  it('testa se o botão de remover favorito funciona', () => {
    const unfavoriteMeal = screen.getByTestId('0-horizontal-favorite-btn');

    userEvent.click(unfavoriteMeal);

    const data = JSON.parse(localStorage.getItem('favoriteRecipes'));
    expect(data.length).toStrictEqual(1);
  });

  it('testa se o botão de copiar link funciona e o nome da receita redireciona', () => {
    const mealName = screen.getByTestId(mealNameTestId);
    const mealShare = screen.getByTestId('0-horizontal-share-btn');
    const drinkShare = screen.getByTestId('1-horizontal-share-btn');

    window.document.execCommand = jest.fn(() => true);
    userEvent.click(mealShare);
    userEvent.click(drinkShare);
    waitFor(() => {
      const text = screen.getAllByText('Link copied!');
      expect(text.length).toStrictEqual(2);
    });

    userEvent.click(mealName);
    waitFor(() => {
      expect(window.location.pathname).toBe('/meals/52771');
    });
  });

  it('testa se o botão de remover favoritos funciona com a lista filtrada por "meals"', () => {
    const meal = screen.getByTestId(mealNameTestId);
    const drink = screen.getByTestId(drinkNameTestId);
    const mealFilter = screen.getByTestId(mealFilterTestId);
    const unfavoriteMeal = screen.getByTestId('0-horizontal-favorite-btn');

    userEvent.click(mealFilter);
    waitFor(() => {
      userEvent.click(unfavoriteMeal);
      expect(meal).not.toBeInTheDocument();
      expect(drink).not.toBeInTheDocument();
    });
  });

  it('testa se o botão de remover favoritos funciona com a lista filtrada por "drinks"', () => {
    const meal = screen.getByTestId(mealNameTestId);
    const drink = screen.getByTestId(drinkNameTestId);
    const drinkFilter = screen.getByTestId('filter-by-drink-btn');
    const unfavoriteDrink = screen.getByTestId('1-horizontal-favorite-btn');

    userEvent.click(drinkFilter);
    waitFor(() => {
      userEvent.click(unfavoriteDrink);
      expect(meal).not.toBeInTheDocument();
      expect(drink).not.toBeInTheDocument();
    });
  });

  it('testa se a tela fica em branco quando localStorage está vazio', () => {
    localStorage.clear();
    const { history } = renderWithRouter(<AppProvider><Routes /></AppProvider>);
    act(() => {
      history.push('/favorite-recipes');
    });

    const mealFilter = screen.getAllByTestId(mealFilterTestId);
    const meal = screen.getAllByTestId(mealNameTestId);
    expect(mealFilter.length).toStrictEqual(2);
    expect(meal.length).toStrictEqual(1);
  });
});
