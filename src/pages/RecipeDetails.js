import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../App.css';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clipboardCopy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import FavoriteButton from '../components/FavoriteButton';

function RecipeDetails(props) {
  const [details, setDetails] = useState([]);
  const [ingredients, setIngredients] = useState(null);
  const [recomendations, setRecomendations] = useState([]);
  const [copied, setCopied] = useState(false);
  const [inProgressRecipe, setInProgressRecipe] = useState(false);
  const [isThisRecipeDone, setIsThisRecipeDone] = useState(false);
  const history = useHistory();
  const { match: { params: { id } } } = props;
  const location = useLocation();
  const { pathname } = location;
  const urlAposDominio = pathname.split('/');
  const type = urlAposDominio[1];

  const getFood = async () => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals;
  };

  const getMealsRecomendations = async () => {
    const magicNumber = 6;
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const recipes = data.meals;
    const slicedMeals = recipes.slice(0, magicNumber);
    return slicedMeals;
  };

  const getDrink = async () => {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.drinks;
  };

  const getDrinksRecomendations = async () => {
    const magicNumber = 6;
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const data = await response.json();
    const recipes = data.drinks;
    const slicedDrinks = recipes.slice(0, magicNumber);
    return slicedDrinks;
  };

  const teste = () => {
    if (type === 'meals') {
      getFood().then((data) => {
        setDetails(data);
      });
      getDrinksRecomendations().then((data) => {
        setRecomendations(data);
      });
    } else {
      getDrink().then((data) => {
        setDetails(data);
      });
      getMealsRecomendations().then((data) => {
        setRecomendations(data);
      });
    }
  };

  useEffect(() => {
    teste();
  }, []);

  useEffect(() => {
    if (details.length > 0) {
      const data = details[0];
      const allIngredients = Object.entries(data)
        .filter((e) => e[0].includes('strIngredient') && e[1])
        .map((e) => e[1]);
      const measures = Object.entries(data)
        .filter((e) => e[0].includes('strMeasure') && e[1])
        .map((e) => e[1]);
      const results = allIngredients.map((e, i) => `${e} ${measures[i]}`);
      setIngredients(results);
    }
  }, [details]);

  const getLink = (youtubeLink) => {
    // if (!youtubeLink) return;
    const embedLink = 'https://www.youtube.com/embed/';
    const linkId = youtubeLink?.split('v=')[1];
    return `${embedLink}${linkId}`;
  };

  const handleClick = () => {
    if (type === 'meals') {
      history.push(`/meals/${id}/in-progress`);
    } else {
      history.push(`/drinks/${id}/in-progress`);
    }
  };

  const copyLink = () => {
    clipboardCopy(`http://localhost:3000${history.location.pathname}`);
    setCopied(true);
  };

  useEffect(() => {
    const currentPath = () => {
      if (pathname.includes('meals')) return 'meals';
      return 'drinks';
    };
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
    if (inProgressRecipes[currentPath()]
      && Object.keys(inProgressRecipes[currentPath()]).includes(id)) {
      setInProgressRecipe(true);
    }
  }, [id, pathname]);

  useEffect(() => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    if (doneRecipes) {
      doneRecipes.forEach((doneRecipe) => {
        if (doneRecipe.id === id) setIsThisRecipeDone(true);
      });
    }
  }, [id]);

  return (
    <div>
      <h1>Detalhes da receita</h1>
      { details.length > 0 && (
        <div>
          <img
            data-testid="recipe-photo"
            src={ details[0]?.strMealThumb || details[0]?.strDrinkThumb }
            alt="Foto da receita"
            style={ { width: '400px' } }
          />
          <h2 data-testid="recipe-title">
            { details[0]?.strMeal || details[0]?.strDrink }
          </h2>
          <button
            data-testid="share-btn"
            onClick={ copyLink }
          >
            <img src={ shareIcon } alt="Compartilhar" />
          </button>
          {copied && <p>Link copied!</p>}
          <FavoriteButton idRecipe={ id } recipe={ details } />
          <h3 data-testid="recipe-category">
            { type === 'meals' ? details[0].strCategory : details[0].strAlcoholic }
          </h3>
          <h3>Ingredientes</h3>
          {
            ingredients && (
              <ul>
                {
                  ingredients.map((e, index) => (

                    <li
                      key={ index }
                      data-testid={ `${index}-ingredient-name-and-measure` }
                    >
                      {e}

                    </li>
                  ))
                }
              </ul>)
          }
          <p data-testid="instructions">
            { details[0]?.strInstructions }
          </p>
          {
            type === 'meals'
           && (<iframe
             data-testid="video"
             src={ getLink(details[0]?.strYoutube) }
             width="420px"
             height="315px"
             title={ `${details[0]?.strMeal}` }
           />)
          }
        </div>
      )}
      <div
        className="carousel"
      >
        <Carousel>
          {
            recomendations.map((recipe, i) => (
              <Carousel.Item
                key={ i }
                data-testid={ `${i}-recommendation-card` }
              >
                <img
                  className="d-block w-100"
                  src={ recipe.strMealThumb || recipe.strDrinkThumb }
                  alt="Foto da receita"
                />
                <h2
                  data-testid={ `${i}-recommendation-title` }
                >
                  {recipe.strMeal || recipe.strDrink}
                </h2>
              </Carousel.Item>
            ))
          }
        </Carousel>
      </div>
      <div>
        { !isThisRecipeDone && (
          <button
            className="startButton"
            type="button"
            data-testid="start-recipe-btn"
            onClick={ handleClick }
          >
            { inProgressRecipe ? 'Continue Recipe' : 'Start Recipe' }
          </button>
        )}
      </div>
    </div>
  );
}

RecipeDetails.propTypes = {
  id: PropTypes.string,
}.isRequired;

export default RecipeDetails;
