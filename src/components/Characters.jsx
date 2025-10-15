import React from "react";

function Characters({ characters, setCharacters }) {
  return (
    <div className="characters">
      <h1>Characters</h1>

      <div className="container-characters">
        {characters.map((character) => (
          <div className="character-container" key={character.id}>
            <div>
              <img src={character.image} alt={character.name} />
            </div>

            <div>
              <h3>{character.name}</h3>
              <h6>
                {character.status === "Alive" ? (
                  <span className="alive">🟢 Alive</span>
                ) : (
                  <span className="dead">🔴 Dead</span>
                )}
              </h6>

              <p>
                <span className="text-grey">Episodios: </span>
                <span>{character.episode.length}</span>
              </p>

              <p>
                <span className="text-grey">Especie: </span>
                <span>{character.species}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Si quieres mantener este botón para volver al inicio */}
      <span className="back-home" onClick={setCharacters}>
        Back Home
      </span>
    </div>
  );
}

export default Characters;
