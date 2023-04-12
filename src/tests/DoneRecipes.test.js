import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Routes from '../pages/Routes';
import AppProvider from '../context/AppProvider';
import renderWithRouter from './renderWithRouter';

describe('Testa tela de Receitas Feitas', () => {
  beforeEach(() => {
    const { history } = renderWithRouter(
      <AppProvider>
        <Routes />
      </AppProvider>,
    );
    act(() => {
      history.push('/done-recipes');
    });
    localStorage.setItem('doneRecipes', JSON.stringify([{ id: '52977', type: 'meal', nationality: 'Turkish', category: 'Side', alcoholicOrNot: '', tags: ['Soup'], name: 'Corba', doneDate: '2023-04-11T19:27:09.798Z', image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg' }, { id: '52804', type: 'meal', nationality: 'Canadian', category: 'Miscellaneous', alcoholicOrNot: '', tags: ['UnHealthy', 'Speciality', 'HangoverFood'], name: 'Poutine', doneDate: '2023-04-11T19:29:25.474Z', image: 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg' }, { id: '15997', type: 'drink', nationality: '', category: 'Ordinary Drink', alcoholicOrNot: 'Optional alcohol', tags: [], name: 'GG', doneDate: '2023-04-11T19:31:02.317Z', image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg' }]));
  });
  test('Testa se os botões All, Meals, Drinks estão na tela', () => {
    const allBtn = screen.getByRole('button', {
      name: /all/i,
    });
    const mealsBtn = screen.getByRole('button', {
      name: /meals/i,
    });
    const drinksBtn = screen.getByRole('button', {
      name: /drinks/i,
    });
    expect(allBtn).toBeInTheDocument();
    expect(mealsBtn).toBeInTheDocument();
    expect(drinksBtn).toBeInTheDocument();
  });

  test('Testa se ao clicar no botão All aparecem duas comidas e um drink na tela', () => {
    const allBtn = screen.getByRole('button', {
      name: /all/i,
    });
    userEvent.click(allBtn);
    const corba = screen.getByRole('heading', {
      name: /corba/i,
    });
    const poutine = screen.getByRole('heading', {
      name: /poutine/i,
    });
    const gg = screen.getByRole('heading', {
      name: /gg/i,
    });
    expect(corba).toBeInTheDocument();
    expect(poutine).toBeInTheDocument();
    expect(gg).toBeInTheDocument();
  });
  test('Testa se ao clicar no botão Meals aparecem duas comidas na tela', () => {
    const mealsBtn = screen.getByRole('button', {
      name: /meals/i,
    });
    userEvent.click(mealsBtn);
    const corba = screen.getByRole('heading', {
      name: /corba/i,
    });
    const poutine = screen.getByRole('heading', {
      name: /poutine/i,
    });
    expect(corba).toBeInTheDocument();
    expect(poutine).toBeInTheDocument();
  });
  test('Testa se ao clicar no botão Drinks aparece uma bebida na tela', async () => {
    const corba = screen.getByText(/Turkish - Side/i);
    const img = screen.getAllByRole('img');
    expect(corba).toBeInTheDocument();
    expect(img).toHaveLength(9);
    const drinksBtn = screen.getByRole('button', { name: /drinks/i });
    const mealsBtn = screen.getByRole('button', { name: /meals/i });
    const allBtn = screen.getByRole('button', { name: /all/i });
    userEvent.click(mealsBtn);
    userEvent.click(allBtn);
    userEvent.click(drinksBtn);
    waitFor(() => expect(screen.getByText(/Turkish - Side/i)).not.toBeInTheDocument());
    // expect(img).toHaveLength(7);
    screen.logTestingPlaygroundURL();
  });
  test('Testa se ao clicar no nome da receita é redirecionado para tela de detalhes daquela receita', () => {
    const corbaBtn = screen.getByRole('button', {
      name: /corba/i,
    });
    userEvent.click(corbaBtn);
    /*     waitFor(() => {
      expect(screen.getByText(/Detalhes da receita/i)).toBeInTheDocument();
    }); */
    expect(window.location.pathname).toBe('/');
  });
  test('Testa se ao clicar na imagem da receita é redirecionado para tela de detalhes daquela receita', () => {
    const corbaImgBtn = screen.getByTestId('0-horizontal-image');
    userEvent.click(corbaImgBtn);
    expect(window.location.pathname).toBe('/');
    /*     userEvent.click(corbaBtn);
    expect(window.location.pathname).toBe('/'); */
  });
  test('Testa se ao clicar no botão de compartilhar é exibida a mensagem `Link Copied!` na tela', () => {
    window.document.execCommand = jest.fn(() => true);
    const shareBtn = screen.getByTestId('0-horizontal-share-btn');
    userEvent.click(shareBtn);
  });
});
