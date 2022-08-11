const SCHOOLS_JSON = "data/schools.json";

let SCHOOLS_DATA = [];

function loadDataFromJSON(file) {
	fetch(file)
	.then(response => response.json())
	.then(data => {
		SCHOOLS_DATA = data;
		document.getElementById('search-field').addEventListener('keyup', function() {
			loadSuggestedSchools(SCHOOLS_DATA);
		});
		document.getElementById('search-field').addEventListener('click', function() {
			loadSuggestedSchools(SCHOOLS_DATA);
		});
	});
}

function loadSuggestedSchools(school_list) {
	input = document.getElementById('search-field').value;
	console.log(input);

	let search_results = fuzzysort.go(input, school_list, {
		key: ['school_name_with_some_districts_attached'],
		limit: 5,
		threshold: -10000
	});
	let search_suggestions = document.getElementById('search-suggestions');
	let search_suggestions_list = document.getElementById('search-suggestions-list');
	search_suggestions_list.innerHTML = '';

	if (search_results.length == 0 && input.length != 0) {
		console.log('no results');
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

function clickSuggestionList(e) {
	let search_field = document.getElementById('search-field');
	search_field.value = e.target.innerText;

	let selected_school_id = e.target.getAttribute('data-id');
	let search_button = document.getElementById('search-button');

	search_button.setAttribute('data-id', selected_school_id);
	search_button.click();
}

function showSuggestionsList() {
	let search_suggestions = document.getElementById('search-suggestions');
	let search_suggestions_list = document.getElementById('search-suggestions-list');
	if (search_suggestions_list.childElementCount > 0) {
		search_suggestions.style.display = 'block';
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

window.onload = (e) => {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');

	let search_height = search_field.offsetHeight;
	let search_width = search_field.offsetWidth;

	search_field.addEventListener('click', showSuggestionsList);

	document.getElementById('search-button').addEventListener('click', clickSearchButton);
	
	document.addEventListener('click', clickOutsideSearchInput);

	search_suggestions.style.top = search_height + 'px';
	search_suggestions.style.width = search_width + 'px';

	loadDataFromJSON(SCHOOLS_JSON);
	// loadDataFromCSV(MERGED_SCHOOLS_CSV);
};

window.addEventListener('resize', function() {
	adjustSuggestionListWidth();
});

function adjustSuggestionListWidth() {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');
	search_suggestions.style.width = search_field.offsetWidth + 'px';
	console.log('search-field width: ' + document.getElementById('search-field').offsetWidth);
}

function clickOutsideSearchInput(e) {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');

	if (!search_suggestions.contains(e.target) && !search_field.contains(e.target) && isVisible(search_suggestions)) {
		search_suggestions.style.display = 'none';
	}
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ); 