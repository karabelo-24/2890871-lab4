const searchBtn=document.getElementById('search-btn');
const countryInput=document.getElementById('country-input');
const countryInfo=document.getElementById('country-info');
const borderGrid=document.getElementById('bordering-countries');
const spinner=document.getElementById('loading-spinner');
const errorMessage=document.getElementById('error-message');

spinner.classList.add('hidden');
errorMessage.classList.add('hidden');

async function searchCountry(countryName) {
    try {

        countryInfo.innerHTML = "";
        borderGrid.innerHTML = "";              
        errorMessage.textContent = "";
        errorMessage.classList.add('hidden');

        if (!countryName) {
            throw new Error("Please enter a country name.");
        }

        spinner.classList.remove('hidden');

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) {
            throw new Error("Country not found. Please try again.");
        }

        const data = await response.json();
        const country = data[0];

      

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="200">
        `;



        if (country.borders && country.borders.length > 0) {

            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => res.json())
            );

            const borderResults = await Promise.all(borderPromises);
            const heading=document.createElement('h3');
            borderGrid.appendChild(heading);
            heading.textContent="Bordering Countries";

            borderResults.forEach(borderData => {
                const borderCountry = borderData[0];

                

                const borderItem = document.createElement('div');
                borderItem.innerHTML = `
                    <img src="${borderCountry.flags.svg}" 
                         alt="${borderCountry.name.common} flag" 
                         width="50">
                    <p>${borderCountry.name.common}</p>
                `;

                borderGrid.appendChild(borderItem);
            
            });

        } else {
            borderGrid.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
      
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
      
        spinner.classList.add('hidden');
    }
}

searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    searchCountry(country);
});


countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = countryInput.value.trim();
        searchCountry(country);
    }
});