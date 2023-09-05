const search = document.querySelector('.js-search');
const list = document.querySelector('.js-list');
search.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();
  //так як ми маємо доступ через атрибути name.. дуже зручно зробити деструктуризацію..
  const { query, days } = evt.currentTarget.elements;
  // передати з нашої форми значення на ф-ію getWeather
  // getWeather отримала promise тому ми оброблюємо його за доп. then
  getWeather(query.value, days.value)
    // далі отримауємо ті данні (data), які ми розпарсили
    .then(data => (list.innerHTML = createMarkup(data.forecast.forecastday)))
    .catch(err => console.log(err));
}

function getWeather(city, days) {
	// з док. достатаємо параметри. (обов'язкові точно треба вказати і інші)
	const BASE_URL = "http://api.weatherapi.com/v1";
	const API_KEY = "61cb5c725ccf4d149a2213222230409";
	// можна зробити URLSearchParams, якщо багато значень
	// const params = new URLSearchParams({
  // key: API_KEY;
  //q: city,
  //days: days,
  //lang: 'de'
  //})
// Не забудь привести до рядка!
  // console.log(params.toString());

  return fetch(
		// `${BASE_URL}/forecast.json?${params}`
		`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&lang=de`
	).then((resp) => {
		// 1 then - це об'єкт респонсу з мета інфо від браузера.. перевірка через if
		// відсіюємо той випадок, коли реcпонс з статусом false
		if (!resp.ok) {
			// throw - примусово створює помилку і переводить на catch
			throw new Error(resp.statusText);
		}
		// статус ok -true
		return resp.json(); //повернення парса
	});
}

//відмальовуємо відповідь з бекенда. Віддаємо знач. дата  у ф-ії де будемо відмальовувати розмітку
function createMarkup(arr) {
  return arr
    .map(
      ({
        date,
        day: {
          avgtemp_c,
          condition: { icon, text },
        },
      }) => `      <li>
    <img src="${icon}" alt="${text}">
    <p>${text}</p>
    <h2>${date}</h2>
    <h3>${avgtemp_c}</h3>
    </li>`
    )
    .join(' ');
}
