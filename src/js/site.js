// const GOOGLE_DOCS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWbwrsqF-c---4lfw0LZWymd-f8sy8sLYkXgzh0OyeGATWwrvv7V1Mq5BcApn7F_-WYKP1KXy5shKw/pub?output=csv";
const MERGED_SCHOOLS = "data/go_pass_schools_merged_with_california_dataset_2022-08-04.csv";

var SCHOOL_DATA = {};

function loadData() {
	Papa.parse(MERGED_SCHOOLS, {
		download: true,
		complete: function(results) {
			SCHOOL_DATA = results.data;

			// x[n] where n is the column number of the school name (starting at 0)
			// x[0] is the row id
			// x[8] is the school name, some with district
			// x[9] is the gopass participation status
			// x[18] is the phone number
			// x[21] is the latitude
			// x[22] is the longitude

			// Create an array of only school names
			// let school_names = SCHOOL_DATA.map(x => x[1]).splice(1);

			// use the header row as the keys
			let header_row = SCHOOL_DATA[0];

			let school_names = SCHOOL_DATA.map(x => (
				{ [header_row[0]]: x.slice(0, 1)[0],
				  [header_row[8]]: x.slice(8, 9)[0],
				  [header_row[9]]: x.slice(9, 10)[0],
				  [header_row[18]]: x.slice(18, 19)[0],
				  [header_row[21]]: x.slice(21, 22)[0],
				  [header_row[22]]: x.slice(22, 23)[0] }
				)).splice(1);
	
			document.getElementById('search-field').addEventListener('keyup', function(e) {
				input = document.getElementById('search-field').value;
				console.log(input);

				let search_results = fuzzysort.go(input, school_names, {
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
					no_results.innerHTML = '<em>School not found</em>';
					no_results.onclick = (e) => {
						console.log('no results clicked');
					};

					search_suggestions_list.appendChild(no_results);
				} else {
					search_results.forEach(element => {
						let list_item = document.createElement('li');

						list_item.innerHTML = fuzzysort.highlight(fuzzysort.single(input, element.target), '<strong>', '</strong>');
						list_item.setAttribute('data-id', element.obj.id);
						list_item.setAttribute('data-gopass', element.obj.participating);
						list_item.addEventListener('click', suggestionClickHandler);

						search_suggestions_list.appendChild(list_item);
						search_suggestions.style.display = 'block';
					});
				}
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

window.onload = (e) => {
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


window.addEventListener('resize', function(e) {
	let search_field = document.getElementById('search-field');
	let search_suggestions = document.getElementById('search-suggestions');
	search_suggestions.style.width = search_field.offsetWidth + 'px';
	console.log('search-field width: ' + document.getElementById('search-field').offsetWidth);
});

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