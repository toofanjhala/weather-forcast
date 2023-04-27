import {parseXml }from "./support.js"
import {xml2json} from "./support.js"

const searchField = document.querySelector('.search-field');
const dropdownContent = document.querySelector('.dropdown-content');
const showdata = document.querySelector('.weather-data');


// Function to fetch city suggestions based on user input
const fetchCities = async (searchTerm) => {
	const res = await fetch(`https://api.worldweatheronline.com/premium/v1/search.ashx?key=701fd0bad49347e68f1104705232604&q=${searchTerm}&format=json`);
	const data = await res.json();
	

	const areaNames = data.search_api.result
		.filter(obj => obj.areaName.length > 0)
		.map(obj => {
			const areaName = obj.areaName[0].value;
			const url = obj.weatherUrl[0].value
			const queryString = url.split("?")[1];


			if (areaName.slice(0, 3).toLowerCase() === searchTerm.slice(0, 3).toLowerCase()) {
				return { area: areaName, Url: queryString };
			} else {
				return null;
			}
		})
		.filter(name => name !== null);

	return areaNames;
};

// Function to display city suggestions in the dropdown
const displayCities = (cities) => {
	
	dropdownContent.innerHTML = '';
	cities.forEach(city => {
		const option = document.createElement('div');
		option.classList.add('fade-in');
		option.innerText = city.area;
		option.addEventListener('click', () => {
			searchField.value = city.area;
			dropdownContent.innerHTML = '';
			test(city.Url)
		});
		dropdownContent.appendChild(option);
	});
};

// Event listener for user input
searchField.addEventListener('input', async () => {
	const searchTerm = searchField.value;
	if (searchTerm.length > 2) {
		const cities = await fetchCities(searchTerm);
		displayCities(cities);
	} else {
		dropdownContent.innerHTML = '';
	}
});

// Hide dropdown when user clicks outside of it
window.addEventListener('click', (event) => {
	if (!event.target.matches('.search-field') && !event.target.matches('.fade-in')) {
		dropdownContent.innerHTML = '';
	}
});


async function test(urll) {
	const xml = await fetch(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=701fd0bad49347e68f1104705232604&${urll}`)
	  .then((res) => res.text());
	const dom = parseXml(xml);
	const document1 = dom.getElementsByTagName('current_condition')[0];
	
	let output = '<ul class="data">';
	for (let i = 0; i < document1.childNodes.length; i++) {
	  const node = document1.childNodes[i];
	  if (node.nodeType === Node.ELEMENT_NODE) {

		output += 
		`<li>
		<div class="card">
		  <h2>${node.nodeName}</h2><br>
		  <p>${node.textContent}</p>
		</div>
	  </li>`
		
	  }
	}
	output += '</ul>';
	
	showdata.innerHTML = output;
  };
  