
/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25,16];

function showTemperatures(container_element, temperature_array) {
	// Clears the container_element’s content, for example by setting the innerHTML to “”.
	container_element.innerHTML = "";

	//For each temperature value in temperature_array, it creates a <p> element with the 
	//temperature value inside (for example <p>13</p>). Please practoce a functional iteration 
	//method instead of an explicit for/while loop
	temperature_array.forEach((temp) => {
		const par = document.createElement('p'); //create the <p> element
		par.textContent = temp.toString();

		// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
		if(temp <= 17) {
			par.classList.add('cold');
		} else if (temp >= 23) {
			par.classList.add('warm');
		}
		container_element.appendChild(par);
	});

}


// Part 1 - DOM

whenDocumentLoaded(() => {
	// Part 1.1: Find the button + on click event
	const button = document.getElementById('btn-part1');

	//Write to the log that it was clicked.
	button.addEventListener('click', () => {
		console.log('The button was clicked');
	});

	// Part 1.2: Write temperatures
	const div_output = document.getElementById('weather-part1');

	btn.addEventListener('click', () => {
		showTemperatures(div_output, TEST_TEMPERATURES);
	});
});

// Part 2 - class

class Forecast {
	constructor(container) {
		this.container = container;
		this.temperatures = [1,2,3,4,5,6,7];
	}

	toString() {
		return 'Forecast(temperature=' + this.temperatures.toString() + ', container=' + this.container.toString() + ')';
	}

	print(){
		console.log(this.toString());
	}

	show() {
		this.container.innerHTML = "";

		// Create a paragraph for each temperature value
		this.temperatures.forEach((temp_value) => {
			const paragraph = document.createElement('p');
			paragraph.textContent = temp_value.toString();

			if(temp_value <= 17) {
				paragraph.classList.add('cold');
			} else if (temp_value >= 23) {
				paragraph.classList.add('warm');
			}

			this.container.appendChild(paragraph);
		});
	}

	reload() {
		this.temperatures = TEST_TEMPERATURES;
		this.show();
	}
}

whenDocumentLoaded(() => {
	const btn = document.getElementById('btn-part1');

	// Part 2: class
	const div_out2 = document.getElementById('weather-part2');
	const forecast2 = new Forecast(div_out2);

	forecast2.print();

	btn.addEventListener('click', () => {
		forecast2.reload();
	});
});

// Part 3 - fetch

const QUERY_LAUSANNE = 'http://api.weatherbit.io/v2.0/forecast/daily?city=Lausanne&days=7&key=ed330abe3f5a4104afd9a6ef10b707ca';

function weatherbitToTemperatures(data) {
	return  data['data'].map(datum => datum["temp"]);
}

class ForecastOnline extends Forecast {
	reload(){
		this.temperatures = [2,3,4,5,6,7,8];

		// this.temperatures = [2,3,4,5,6,7,8];

		fetch(QUERY_LAUSANNE)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log('data', data);
			this.temperatures = weatherbitToTemperatures(data);
		})
		.then(() => {
			this.show();
		});
	}
}

whenDocumentLoaded(() => {
	const btn = document.getElementById('btn-part1');

	// Part 2: inheritance
	const forecast3 = new ForecastOnline(document.getElementById('weather-part3'));

	btn.addEventListener('click', () => {
		forecast3.reload();
	});
});

// Part 4 - interactive

class ForecastOnlineCity extends ForecastOnline {

	setCity(city) {
		this.city = city;
	}

	reload() {
		const query = (
			'http://api.weatherbit.io/v2.0/forecast/daily?city='+ this.city + '&days=7&key=ed330abe3f5a4104afd9a6ef10b707ca'

		);
		fetch(query)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				this.temperatures = weatherbitToTemperatures(data);
				this.city = data['city_name'];
			})
			.then(() => {
				this.show();
			});
	}

	show() {
		super.show();

		const elem_city_name = document.createElement('h4');
		elem_city_name.textContent = this.city;
		this.container.insertBefore(elem_city_name, this.container.children[0]);
	}
}

whenDocumentLoaded(() => {
	const city_query_input = document.getElementById('query-city');
	const btn_query = document.getElementById('btn-city');

	// Part 2: inheritance
	const forecast_city = new ForecastOnlineCity(document.getElementById('weather-city'));

	btn_query.addEventListener('click', () => {
		const new_city_name = city_query_input.value;
		console.log('Query =', new_city_name);

		forecast_city.setCity(new_city_name);
		forecast_city.reload();
	})
});
