window.addEventListener("load", function () {

    //Endpoint #1 

    let allPokemonArray = null;

    async function getAllPokemon() {
        let response = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon`);
        allPokemonArray = await response.json();
        displayAllPokemon(allPokemonArray);

        const storedFavorites = localStorage.getItem('favoritePokemon');
        if (storedFavorites) {
            storedFavoritePokemon = new Set(JSON.parse(storedFavorites));
        }

        renderFavorites();

    }

    function displayAllPokemon(allPokemonArray) {
        const pokemonNameElement = document.querySelector(".all-pokemon-sidebar-left");
        const heartButtonArray = [];

        allPokemonArray.forEach(function (pokemon) {

            const container = document.createElement("div");
            container.classList.add("pokemon-container");

            const heartButtonDiv = document.createElement("div");
            heartButtonDiv.innerHTML = `
            <button class="heart-button" data-dex="${pokemon.dexNumber}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 16.35 2 12.28 2 8.50 2 5.42 4.42 3 7.50 3c1.74 0 3.41.81 4.50 2.09C13.09 3.81 14.76 3 16.50 3 19.58 3 22 5.42 22 8.50c0 3.78-3.40 7.85-8.55 11.54"/>
                </svg>
            </button>
            `;

            const pokemonNameParagraph = document.createElement("div");
            pokemonNameParagraph.textContent = pokemon.name;
            pokemonNameParagraph.classList.add("pokemon-name");

            container.appendChild(heartButtonDiv);
            container.appendChild(pokemonNameParagraph);

            pokemonNameElement.appendChild(container);

            heartButtonArray.push(heartButtonDiv);

            pokemonNameParagraph.addEventListener("click", function (event) {
                const selectedPokemon = pokemon;
                const dexNumber = selectedPokemon.dexNumber;
                getPokemonByDex(dexNumber);
            });
            heartButtonFunction(heartButtonArray, allPokemonArray, heartButtonDiv);

        });

    };

    getAllPokemon();


    //Favorites section

    let storedFavoritePokemon = new Set(JSON.parse(localStorage.getItem('favoritePokemon'))) || new Set();

    function heartButtonFunction() {
        const heartButtons = document.querySelectorAll(".heart-button");

        heartButtons.forEach((heartButton) => {
            heartButton.addEventListener("click", function () {
                const dexNumberString = heartButton.getAttribute("data-dex");
                const dexNumber = parseInt(dexNumberString, 10);

                const selectedPokemon = allPokemonArray.find((pokemon) => pokemon.dexNumber == dexNumber);

                if (storedFavoritePokemon.has(selectedPokemon.dexNumber)) {
                    storedFavoritePokemon.delete(selectedPokemon.name);
                } else {
                    storedFavoritePokemon.add(selectedPokemon.name);
                }

                localStorage.setItem('favoritePokemon', JSON.stringify(Array.from(storedFavoritePokemon)));

                renderFavorites();
            });
        });
    }

    function renderFavorites() {
        const favoritesSection = document.querySelector(".favorites-section");
        favoritesSection.innerHTML = "";

        storedFavoritePokemon.forEach((pokemonName) => {
            const favoritePokemonDiv = document.createElement("div");
            favoritePokemonDiv.classList.add("favorites-marker");

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.setAttribute("data-name", pokemonName);

            removeButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 16.35 2 12.28 2 8.50 2 5.42 4.42 3 7.50 3c1.74 0 3.41.81 4.50 2.09C13.09 3.81 14.76 3 16.50 3 19.58 3 22 5.42 22 8.50c0 3.78-3.40 7.85-8.55 11.54"/>
                </svg>
            `;

            removeButton.addEventListener("click", function () {
                removeFavorite(pokemonName);
            });

            const pokemonNameDiv = document.createElement("div");
            pokemonNameDiv.textContent = pokemonName;
            pokemonNameDiv.classList.add("favorite-pokemon-name");

            favoritePokemonDiv.appendChild(pokemonNameDiv);
            favoritePokemonDiv.appendChild(removeButton);

            favoritesSection.appendChild(favoritePokemonDiv);

            pokemonNameDiv.addEventListener("click", function () {
                updatePokemonDetails();

            });

        });
    }

    function removeFavorite(pokemonName) {
        storedFavoritePokemon.delete(pokemonName);
        localStorage.setItem('favoritePokemon', JSON.stringify(Array.from(storedFavoritePokemon)));
        renderFavorites();
    }

    heartButtonFunction();

    //Favourites End 


    // //Endpoint #2 

    async function updatePokemonDetails(pokemonData) {

        const pokemonDetailsFor = document.querySelector(".pokemon-details-for");
        pokemonDetailsFor.innerHTML = `<h2>Pokemon details for ${pokemonData.name}<h2> `;

        const pokemonImage = document.querySelector(".image-url");
        pokemonImage.innerHTML = `<img src=${pokemonData.imageUrl}>`;
        pokemonImage.className = "image-url";

        const pokedexNumber = document.querySelector(".pokedex-number");
        pokedexNumber.innerHTML = `Pokedex number: #${pokemonData.dexNumber}`;

        const pokemonDescription = document.querySelector("#description");
        pokemonDescription.innerHTML = `${pokemonData.dexEntry}`;

        const typeInfo = document.querySelector("#type-info");
        typeInfo.innerHTML = `${pokemonData.name}'s type(s): ${pokemonData.types.join(", ")}`;

        const tableContainer = document.querySelector(".table-container");
        tableContainer.innerHTML = "";

        await getPokemonDataAndDisplayTypeTable(pokemonData.types);

        const defenseTableContainer = document.querySelector(".defense-table-container");
        defenseTableContainer.innerHTML = "";

        await getDefenseProfileTable(pokemonData.dexNumber);

    }

    async function getPokemonByDex(dexNumber) {
        const dataResponse = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/${dexNumber}`);
        const pokemonData = await dataResponse.json();
        updatePokemonDetails(pokemonData);
    }

    //Endpoint #3
    async function getRandomPokemon() {
        const randomResponse = await fetch("https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/random");
        const pokemonData = await randomResponse.json();
        updatePokemonDetails(pokemonData);
    }
    getRandomPokemon();

    //Endpoint #4 
    const multiplierWords = {
        0: "No damage",
        0.25: "Quarter damage",
        0.5: "Half damage",
        1: "Normal damage",
        2: "Double damage",
        4: "Quadruple damage",
    };

    async function getPokemonDataAndDisplayTypeTable(types) {
        for (const type of types) {
            const dataResponse = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/types/${type}`);
            const pokemonTypeData = await dataResponse.json();
            const table = generatePokemonDataTable(pokemonTypeData);

            const tableContainer = document.querySelector(".table-container");
            tableContainer.appendChild(table);
        }
    }

    function generatePokemonDataTable(pokemonTypeData) {
        const table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th colspan="2" class="table-title">${pokemonTypeData.name.charAt(0).toUpperCase() + pokemonTypeData.name.slice(1)} type attacks:</th>
            </tr>
            <tr>
                <th class="table-header">Defending Type</th>
                <th class="table-header">Damage Dealt</th>
            </tr>
        `;

        for (const offenseMultiplier of pokemonTypeData.offenseDamageMultipliers) {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${offenseMultiplier.type}</td>
            <td>${multiplierWords[offenseMultiplier.multiplier]}</td>
        `;
            table.appendChild(row);
        }
        return table;
    }

    //Endpoint #5 

    async function getDefenseProfileTable(dexNumber) {
        const defenseDataResponse = await fetch(`https://cs719-a01-pt-server.trex-sandwich.com/api/pokemon/${dexNumber}/defense-profile`);
        const defenseData = await defenseDataResponse.json();
        const defenseTable = generateDefenseTable(defenseData);

        const defenseTableContainer = document.querySelector(".defense-table-container");
        defenseTableContainer.appendChild(defenseTable);
    }

    function generateDefenseTable(defenseData) {
        const table = document.createElement("table");
        table.innerHTML = `
            <tr>
                <th class="table-header">Attacking Type</th>
                <th class="table-header">Damage Received</th>
            </tr>
        `;

        for (const defenseEntry of defenseData) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${defenseEntry.type}</td>
                <td>${multiplierWords[defenseEntry.multiplier]}</td>
            `;
            table.appendChild(row);
        }

        return table;
    }

});







