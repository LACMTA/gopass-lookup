const GOOGLE_DOCS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWbwrsqF-c---4lfw0LZWymd-f8sy8sLYkXgzh0OyeGATWwrvv7V1Mq5BcApn7F_-WYKP1KXy5shKw/pub?output=csv";

var SCHOOL_DATA = {};

function loadData() {
	Papa.parse(GOOGLE_DOCS_URL, {
		download: true,
		complete: function(results) {
			SCHOOL_DATA = results.data;

			// x[n] where n is the column number of the school name (starting at 0)
			let school_names = SCHOOL_DATA.map(x => x[1]).splice(1);
	
			document.getElementById('search-field').addEventListener('keyup', function(e) {
				input = document.getElementById('search-field').value;
				console.log(input);
				let search_results = fuzzysort.go(input, school_names, {
					limit: 5,
					allowType: true,
					threshold: -10000
				});
				let search_suggestions = document.getElementById('search-suggestions');
				let search_suggestions_list = document.getElementById('search-suggestions-list');
				search_suggestions_list.innerHTML = '';

				search_results.forEach(element => {
					let list_item = document.createElement('li');
					list_item.innerHTML = fuzzysort.highlight(fuzzysort.single(input, element.target), '<strong>', '</strong>');
					list_item.addEventListener('click', suggestionClickHandler);

					search_suggestions_list.appendChild(list_item);
					search_suggestions.style.display = 'block';
				});
			});
		}
	});
}

function suggestionClickHandler(e) {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');
	search_field.value = e.target.innerText;

	document.getElementById('search-button').click();
}


window.onload = (event) => {
	console.log('window loaded');
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');

	let search_height = search_field.offsetHeight;
	let search_width = search_field.offsetWidth;

	search_field.addEventListener('click', function(e) {
		let search_suggestions_list = document.getElementById('search-suggestions-list');
		if (search_suggestions_list.childElementCount > 0) {
			search_suggestions.style.display = 'block';
		}
	});

	document.getElementById('search-button').addEventListener('click', function(e) {
		search_suggestions.style.display = 'none';
		let results_section = document.getElementById('results-section');
		results_section.innerHTML = '';
		let content = document.createElement('p');
		content.innerHTML = 'Something selected!';
		results_section.appendChild(content);
	});
	
	hideOnClickOutside();

	search_suggestions.style.top = search_height + 'px';
	search_suggestions.style.width = search_width + 'px';

	loadData();
};

function hideOnClickOutside() {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');

    const outsideClickListener = event => {
        if (!search_suggestions.contains(event.target) && !search_field.contains(event.target) && isVisible(search_suggestions)) {
			search_suggestions.style.display = 'none';
        }
    };

    document.addEventListener('click', outsideClickListener);
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ); 