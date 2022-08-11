const SCHOOLS_JSON = "data/schools.json";

let SCHOOLS_DATA = [];

loadDataFromJSON(SCHOOLS_JSON);

document.addEventListener('click', clickOutsideSearchInput);

window.onload = (e) => {
	let search_field = document.getElementById('search-field');
	search_field.addEventListener('click', showSuggestionList);
	search_field.addEventListener('input', function() {
		loadSuggestedSchools(SCHOOLS_DATA);
	});

	let search_suggestions = document.getElementById('search-suggestions');

	let search_height = search_field.offsetHeight;
	let search_width = search_field.offsetWidth;

	search_suggestions.style.top = search_height + 'px';
	search_suggestions.style.width = search_width + 'px';

	document.getElementById('search-button').addEventListener('click', clickSearchButton);
};

function loadDataFromJSON(file) {
	fetch(file)
		.then(response => response.json())
		.then(data => {
			SCHOOLS_DATA = data;
			document.getElementById('search-field').addEventListener('keydown', function (e) {
				navigateSuggestionList(e);
			});
			document.getElementById('search-field').addEventListener('click', function () {
				loadSuggestedSchools(SCHOOLS_DATA);
			});
		});
}

function loadSuggestedSchools(school_list) {
	input = document.getElementById('search-field').value;

	if (input != '') {
		let search_results = fuzzysort.go(input, school_list, {
			key: ['school_name_with_some_districts_attached'],
			limit: 5,
			threshold: -10000
		});
		let search_suggestions = document.getElementById('search-suggestions');
		let search_suggestions_list = document.getElementById('search-suggestions-list');
		search_suggestions_list.innerHTML = '';

		if (search_results.length == 0 && input.length != 0) {
			let no_results = document.createElement('li');
			no_results.innerHTML = '<em>School not found? Let us know!</em>';
			no_results.onclick = (e) => {
				let search_button = document.getElementById('search-button');
				search_button.click();
			};

			search_suggestions_list.appendChild(no_results);
		} else {
			search_results.forEach(element => {
				let list_item = document.createElement('li');

				list_item.innerHTML = fuzzysort.highlight(fuzzysort.single(input, element.target), '<strong>', '</strong>');
				list_item.setAttribute('data-id', element.obj.index);
				list_item.setAttribute('data-gopass', element.obj.participating);
				list_item.addEventListener('click', clickSuggestionList);

				search_suggestions_list.appendChild(list_item);
				search_suggestions.style.display = 'block';
			});
		}
	}
}

function clickSuggestionList(e) {
	let search_field = document.getElementById('search-field');
	search_field.value = e.target.innerText;

	let selected_school_id = e.target.getAttribute('data-id');
	let search_button = document.getElementById('search-button');

	search_button.setAttribute('data-id', selected_school_id);
	search_button.click();
}

function showSuggestionList() {
	let search_suggestions = document.getElementById('search-suggestions');
	let search_suggestions_list = document.getElementById('search-suggestions-list');
	if (search_suggestions_list.childElementCount > 0) {
		search_suggestions.style.display = 'block';
	}
}

function navigateSuggestionList(event) {
	console.log(event.target);
	let search_suggestions = document.getElementById('search-suggestions');
	let suggestion_list_items = document.querySelectorAll('#search-suggestions-list > li');
	let active_suggestion = document.querySelector('#search-suggestions-list > li.active');
	// up: 38
	// down: 40
	console.log(search_suggestions.querySelector('li'));
	console.log(search_suggestions.querySelector('li').classList);
	console.log(search_suggestions.querySelector('li').classList.contains('active'));
	console.log('list items: ' + suggestion_list_items[0].classList);

	if (isVisible(search_suggestions)) {
		switch (event.keyCode) {
			case 38:
				if (active_suggestion != null) {
					active_suggestion.classList.toggle('active');
					if (active_suggestion.previousElementSibling != null) {
						active_suggestion.previousElementSibling.classList.toggle('active');
					} else {
						suggestion_list_items[suggestion_list_items.length - 1].classList.toggle('active');
					}
				} else {
					suggestion_list_items[suggestion_list_items.length - 1].classList.toggle('active');
				}
				break;
			case 40:
				if (active_suggestion != null) {
					active_suggestion.classList.toggle('active');

					if (active_suggestion.nextElementSibling != null) {
						active_suggestion.nextElementSibling.classList.toggle('active');
					} else {
						suggestion_list_items[0].classList.toggle('active');
					}
				} else {
					suggestion_list_items[0].classList.toggle('active');
				}
				break;
			case 13:
				if (active_suggestion != null) {
					active_suggestion.click();
				}
				break;
		}
	}
}

function clickSearchButton() {
	let search_suggestions = document.getElementById('search-suggestions');
	search_suggestions.style.display = 'none';

	let id = this.getAttribute('data-id');

	if (id != null) {
		window.location.href = "schools/" + this.getAttribute('data-id');
	} else {
		window.location.href = "not-found/";
	}
}


window.addEventListener('resize', function () {
	adjustSuggestionListWidth();
});

function adjustSuggestionListWidth() {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');
	search_suggestions.style.width = search_field.offsetWidth + 'px';
}

function clickOutsideSearchInput(e) {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');

	if (!search_suggestions.contains(e.target) && !search_field.contains(e.target) && isVisible(search_suggestions)) {
		search_suggestions.style.display = 'none';
	}
}

const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length); 