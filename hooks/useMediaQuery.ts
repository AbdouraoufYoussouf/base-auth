import { useState, useEffect } from 'react';

function useMediaQuery(query:string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Fonction de rappel pour gérer les changements de la requête
    function handleChange() {
      setMatches(matchMedia.matches);
    }

    // Ajoute un écouteur d'événement pour les changements de la requête
    matchMedia.addEventListener('change', handleChange);

    // Déclenche l'écouteur d'événement initialement
    handleChange();

    // Nettoie l'écouteur d'événement lors du démontage du composant
    return () => matchMedia.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;

export function useBelowViewportWidth(size:number) {
  const [isBelow, setIsBelow] = useState(false);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setIsBelow(width < size);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  return isBelow;
}
