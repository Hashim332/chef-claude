import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromChefClaude } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);

  const [recipe, setRecipe] = React.useState("");
  const recipeSection = React.useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function getRecipe() {
    console.log("Setting loading to true");
    setIsLoading(true);
    try {
      const recipeMarkdown = await getRecipeFromChefClaude(ingredients);
      setRecipe(recipeMarkdown);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  return (
    <main>
      <h2>Enter at least 4 ingredients to get a recipe!</h2>
      <form action={addIngredient} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
          required
        />
        <button>Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          getRecipe={getRecipe}
          isLoading={isLoading}
        />
      )}

      {recipe && (
        <div ref={recipeSection}>
          <ClaudeRecipe recipe={recipe} />
        </div>
      )}
    </main>
  );
}
