import React, { useState } from "react";
import imagenRickMorty from "./img/rick-morty.png";
import "./App.css";
import Characters from "./components/Characters";

const App = () => {
  const [characters, setCharacters] = useState(null);   // null = pantalla inicial
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Trae personajes con soporte de página y nombre (búsqueda)
  const fetchCharacters = async (nextPage = page, nextQuery = query) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", nextPage);
      if (nextQuery.trim()) params.set("name", nextQuery.trim());

      const res = await fetch(
        `https://rickandmortyapi.com/api/character/?${params.toString()}`
      );

      // La API regresa 404 cuando no hay resultados
      if (!res.ok) {
        if (res.status === 404) {
          setCharacters([]);        // sin resultados
          setTotalPages(0);
          setPage(1);
          setLoading(false);
          return;
        }
        throw new Error("Error al consultar la API");
      }

      const data = await res.json();
      setCharacters(data.results);
      setTotalPages(data.info.pages);
      setPage(nextPage);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Botón de la pantalla inicial
  const start = () => fetchCharacters(1, "");

  // Enviar el formulario de búsqueda
  const onSearchSubmit = (e) => {
    e.preventDefault();
    fetchCharacters(1, query); // siempre vuelve a la página 1 al buscar
  };

  // Navegación
  const prevPage = () => page > 1 && fetchCharacters(page - 1, query);
  const nextPage = () => page < totalPages && fetchCharacters(page + 1, query);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Rick & Morty</h1>

        {/* Pantalla inicial */}
        {characters === null ? (
          <>
            <img src={imagenRickMorty} alt="Rick & Morty" className="img-home" />
            <button onClick={start} className="btn-search">
              Cargar Personajes
            </button>
          </>
        ) : (
          <>
            {/* Barra de búsqueda */}
            <form onSubmit={onSearchSubmit} className="search-bar">
              <input
                type="text"
                placeholder="Buscar por nombre…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-search"
              />
              <button type="submit" className="btn-search">Buscar</button>
              <button
                type="button"
                className="btn-clear"
                onClick={() => { setQuery(""); fetchCharacters(1, ""); }}
              >
                Limpiar
              </button>
            </form>

            {/* Estado de carga / error */}
            {loading && <p>Cargando…</p>}
            {error && <p style={{ color: "salmon" }}>{error}</p>}
            {!loading && characters?.length === 0 && <p>Sin resultados.</p>}

            {/* Lista */}
            {!loading && characters?.length > 0 && (
              <Characters characters={characters} setCharacters={() => setCharacters(null)} />
            )}

            {/* Paginación */}
            {!loading && totalPages > 0 && (
              <div className="pager">
                <button onClick={prevPage} disabled={page <= 1}>
                  ◀ Anterior
                </button>
                <span>
                  Página {page} de {totalPages}
                </span>
                <button onClick={nextPage} disabled={page >= totalPages}>
                  Siguiente ▶
                </button>
              </div>
            )}
          </>
        )}
      </header>
    </div>
  );
};

export default App;
