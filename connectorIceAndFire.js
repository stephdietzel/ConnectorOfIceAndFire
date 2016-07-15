(function () {
    var myConnector = tableau.makeConnector();
    var pageLimit = 100;

/**
    var cultureNormalizingMap = {
    	"andal" : "Andal",
    	"andals" : "Andal",
    	"asshai" : "Asshai",
    	"asshai'i" : "Asshai",
    	"astapor" : "Astapori",
    	"astapori" : "Astapori",
    	"braavos" : "Braavosi",
    	"braavosi" : "Braavosi",
    	"dorne" : "Dornish",
    	"dornish" : "Dornish",
    	"dornishmen" : "Dornish",
    	"free folk" : "Free Folk",
    	"ghis" : "Ghiscari",
    	"ghiscari" : "Ghiscari",
    	"ghiscaricari" : "Ghiscari",
    	"ironborn" : "Ironborn",
    	"ironmen" : "Ironborn",
    	"lhazareen" : "Lhazarene",
    	"lhazarene" : "Lhazarene",
    	"lysene" : "Lysene",
    	"lyseni" : "Lysene",
    	"meereen" : "Meereenese",
    	"meereenese" : "Meereenese",
    	"mountain clans" : "Mountain Clans",
    	"myr" : "Myrish",
    	"myrish" : "Myrish",
    	"myrmen" : "Myrish",
    	"norvos" : "Norvosi",
    	"norvosi" : "Norvosi",
    	"quarth" : "Quarth",
    	"quartheen" : "Quarth",
    	"stormlander" : "Stormlander",
    	"stormlands" : "Stormlander",
    	"summer islander" : "Summer Islander",
    	"summer islands" : "Summer Islander", 
    	"summer isles" : "Summer Islander",
    	"vale" : "Vale",
    	"valeman" : "Vale",
    	"westeros" : "Westerosi",
    	"westerosi" : "Westerosi",
    	"wildling" : "Wildling",
    	"wildlings" : "Wildling"
    };
    **/

    function getCulture(rawCultureString) {
    	var mappedCulture = null; //cultureNormalizingMap[rawCultureString.toLowerCase()];
    	return mappedCulture ? mappedCulture : rawCultureString;
    }

    function getNameAndAliases(record) {
    	var name = "";

    	if (record.name)
    	{
    		name = record.name;
    	}
		if (record.aliases && record.aliases.length > 0)
		{
			name += " (";
			for (var j = 0, len2 = record.aliases.length; j < len2; j++)
			{
				name += record.aliases[j];
				name += j + 1 === len2 ? "" : ", ";
			}
			name += ")";
		}

		return name;
	}

    function processCharacterData(tableData, resp) {    	
	    // Iterate over the JSON object for each character
	    for (var i = 0, len = resp.length; i < len; i++) {
	    	var record = resp[i];
	    	var name = getNameAndAliases(record);
	    	var culture = getCulture(record.culture);
	    	var titles = record.titles.join(", ");
	    	var playedBy = record.playedBy.join(", ");
	    	var seasons = record.tvSeries.join(", ");

	    	// Now duplicate rows with multiple houses, books, and POV books
	    	var allBooks = record.books.concat(record.povBooks);
	    	var numHouses = record.allegiances.length;
	    	var numBooks = allBooks.length; 
	    	var numPovBooks = record.povBooks.length;
	    	var max = Math.max(numHouses, numBooks, numPovBooks);

	    	for (var j = 0; j < max; j++) {
	    		var house = record.allegiances[Math.min(j, numHouses -1)];
	    		var book = allBooks[Math.min(j, numBooks -1)];
	    		var povBook = record.povBooks[Math.min(j, numPovBooks -1)];

		        tableData.push({
		            "charUrl": record.url,
		            "name": name,
		            "gender": record.gender,
		            "culture": culture,
		            "titles": titles,
		            "born": record.born,
		            "died": record.died,
		            "playedBy": playedBy,
		            "fatherUrl" : record.father,
		            "motherUrl" : record.mother,
		            "spouseUrl" : record.spouse,
		            "seasons" : seasons,
		            "allegiance" : house,
		            "bookUrl" : book,
		            "povBookUrl" : povBook
		        });
	    	}
	    }
    }

    function processBookData(tableData, resp) {
	    // Iterate over the JSON object for each character
	    for (var i = 0, len = resp.length; i < len; i++) {
	    	var record = resp[i];
	    	var authors = record.authors.join(", ");

	    	// Now duplicate rows with multiple characters and POV characters
	    	var allCharacters = record.characters.concat(record.povCharacters);
	    	var numCharacters = allCharacters.length; 
	    	var numPovCharacters = record.povCharacters.length;
	    	var max = Math.max(numCharacters, numPovCharacters);

	    	for (var j = 0; j < max; j++) {
	    		var character = allCharacters[Math.min(j, numCharacters -1)];
	    		var povCharacter = record.povCharacters[Math.min(j, numPovCharacters -1)];

		        tableData.push({
		            "bookUrl": record.url,
		            "name": record.name,
		            "isbn": record.isbn,
		            "authors": authors,
		            "numberOfPages": record.numberOfPages,
		            "publisher": record.publisher,
		            "country": record.country,
		            "mediaType": record.mediaType,
		            "released" : record.released,
		            "characterUrl" : character,
		            "povCharacterUrl" : povCharacter
		        });
	    	}
	    }
    }

    function processHouseData(tableData, resp) {
    	// Iterate over the JSON object for each character
	    for (var i = 0, len = resp.length; i < len; i++) {
	    	var record = resp[i];
	    	var titles = record.titles.join(", ");
	    	var seats = record.seats.join(", ");
	    	var ancestralWeapons = record.ancestralWeapons.join(", ");

	    	// Now duplicate rows with multiple cadet branches and sworn members
	    	var numCadetBranches = record.cadetBranches.length; 
	    	var numSwornMembers = record.swornMembers.length;
	    	var max = Math.max(numCadetBranches, numSwornMembers);

	    	for (var j = 0; j < max; j++) {
	    		var cadetBranch = record.cadetBranches[Math.min(j, numCadetBranches -1)];
	    		var swornMember = record.swornMembers[Math.min(j, numSwornMembers -1)];

		        tableData.push({
		            "houseUrl": record.url,
		            "name": record.name,
		            "region": record.region,
		            "coatOfArms": record.coatOfArms,
		            "titles": titles,
		            "seats": seats,
		            "currentLord": record.currentLord,
		            "heir": record.heir,
		            "overlord" : record.overlord,
		            "founded" : record.founded,
		            "founder" : record.founder,
		            "diedOut" : record.diedOut,
		            "ancestralWeapons" : ancestralWeapons,
		            "cadetBranch" : cadetBranch,
		            "swornMember" : swornMember
		        });
	    	}
	    }
    }
 
    myConnector.getSchema = function (schemaCallback) {
	    var character_cols = [
	        { id : "charUrl", alias : "Character URL", dataType : tableau.dataTypeEnum.string, description: "The hypermedia URL of this resource."},
	        { id : "name", alias : "Character Name", dataType : tableau.dataTypeEnum.string, description: "The name of this character, plus aliases."},
	        { id : "gender", alias : "Gender", dataType : tableau.dataTypeEnum.string, description: "The gender of this character. Possible values are: Female, Male and Unknown."},
	        { id : "culture", alias : "Culture", dataType : tableau.dataTypeEnum.string, description: "The culture that this character belongs to."},
	        { id : "titles", alias : "Titles", dataType : tableau.dataTypeEnum.string, description: "The titles that this character holds."},
	        { id : "born", alias : "Born", dataType : tableau.dataTypeEnum.string, description: "The year that this person was born."},
	        { id : "died", alias : "Died", dataType : tableau.dataTypeEnum.string, description: "The year that this person died."},
	        { id : "playedBy", alias : "Played By", dataType : tableau.dataTypeEnum.string, description: "Actors that have played this character in the TV show."},
	        { id : "fatherUrl", alias : "Father Url", dataType : tableau.dataTypeEnum.string, description: "The character URL of this resource's father."},
	        { id : "motherUrl", alias : "Mother Url", dataType : tableau.dataTypeEnum.string, description: "The character URL of this resource's mother."},
	        { id : "spouseUrl", alias : "Spouse Url", dataType : tableau.dataTypeEnum.string, description: "The character URL of this resource's spouse."},
	        { id : "allegiance", alias : "allegianceUrl", dataType : tableau.dataTypeEnum.string, description: "The House URL of this resource's house allegiance."},
	        { id : "bookUrl", alias : "Book Url", dataType : tableau.dataTypeEnum.string, description: "The Book URL where this character appears."},
	        { id : "povBookUrl", alias : "POV Book Url", dataType : tableau.dataTypeEnum.string, description: "The Book URL where this character has a POV chapter."},
	        { id : "seasons", alias : "Seasons", dataType : tableau.dataTypeEnum.string, description: "The seasons of the TV show this character has been in."}
	    ];

	    var character_tableInfo = {
	        id : "characterData",
	        alias : "Characters",
	        columns : character_cols
	    };

	    var book_cols = [
	        { id : "bookUrl", alias : "Book URL", dataType : tableau.dataTypeEnum.string, description: "The hypermedia URL of this resource."},
	        { id : "name", alias : "Book Name", dataType : tableau.dataTypeEnum.string, description: "The name of this book."},
	        { id : "isbn", alias : "ISBN", dataType : tableau.dataTypeEnum.string, description: "The isbn of this book."},
	        { id : "authors", alias : "Authors", dataType : tableau.dataTypeEnum.string, description: "The authors of this book."},
	        { id : "numberOfPages", alias : "Number of Page", dataType : tableau.dataTypeEnum.int, aggType : tableau.aggTypeEnum.avg, description: "The number of pages in this book."},
	        { id : "publisher", alias : "Publisher", dataType : tableau.dataTypeEnum.string, description: "The company that published this book."},
	        { id : "country", alias : "Country", dataType : tableau.dataTypeEnum.string, description: "The country which this book was published in."},
	        { id : "mediaType", alias : "Media Type", dataType : tableau.dataTypeEnum.string, description: "The type of media this book was released in. Possible values are: Hardback, Hardcover, GraphicNovel and Paperback."},
	        { id : "released", alias : "Release Date", dataType : tableau.dataTypeEnum.date, description: "The date, in ISO 8601 format, which this book was released."},
	        { id : "characterUrl", alias : "Character URL", dataType : tableau.dataTypeEnum.string, description: "Character resource URLs that has been in this book."},
	        { id : "povCharacterUrl", alias : "POV Character URL", dataType : tableau.dataTypeEnum.string, description: "Character resource URLs that has had a POV-chapter in this book."}        
	    ];

	    var book_tableInfo = {
	        id : "bookData",
	        alias : "Books",
	        columns : book_cols
	    };

	    var house_cols = [
	        { id : "houseUrl", alias : "House URL", dataType : tableau.dataTypeEnum.string, description: "The hypermedia URL of this resource."},
	        { id : "name", alias : "House Name", dataType : tableau.dataTypeEnum.string, description: "The name of this house."},
	        { id : "region", alias : "Region", dataType : tableau.dataTypeEnum.string, description: "The region that this house resides in."},
	        { id : "coatOfArms", alias : "Coat of Arms", dataType : tableau.dataTypeEnum.string, description: "Text describing the coat of arms of this house."},
	        { id : "titles", alias : "Titles", dataType : tableau.dataTypeEnum.string, description: "The titles this house holds."},
	        { id : "seats", alias : "Seats", dataType : tableau.dataTypeEnum.string, description: "The seats this house holds."},
	        { id : "currentLord", alias : "Current Lord URL", dataType : tableau.dataTypeEnum.string, description: "The Character URL of this house's current lord."},
	        { id : "heir", alias : "Heir URL", dataType : tableau.dataTypeEnum.string, description: "The Character URL of this house's heir."},
	        { id : "overlord", alias : "Overlord URL", dataType : tableau.dataTypeEnum.date, description: "The House resource URL that this house answers to."},
	        { id : "founded", alias : "Founded", dataType : tableau.dataTypeEnum.string, description: "The year that this house was founded."},
	        { id : "founder", alias : "Founder URL", dataType : tableau.dataTypeEnum.string, description: "The Character resource URL that founded this house."},
	        { id : "diedOut", alias : "Died Out", dataType : tableau.dataTypeEnum.string, description: "The year that this house died out."},
	        { id : "ancestralWeapons", alias : "Ancestral Weapons", dataType : tableau.dataTypeEnum.string, description: "The names of the noteworthy weapons that this house owns."},
	        { id : "cadetBranch", alias : "Cadet Branch URL", dataType : tableau.dataTypeEnum.string, description: "A House resource URL that was founded from this house."},
	        { id : "swornMember", alias : "Sworn Member URL", dataType : tableau.dataTypeEnum.string, description: "A Character resource URL that is sworn to this house."}   
	    ];

	    var house_tableInfo = {
	        id : "houseData",
	        alias : "Houses",
	        columns : house_cols
	    };

	    schemaCallback([character_tableInfo, book_tableInfo, house_tableInfo]);
 
    };

    function fetch(api, pageNumber, processCallback, finishedCallback)
    {
    	$.getJSON("http://www.anapioficeandfire.com/api/" + api +"?page=" + pageNumber + "&pageSize=50", function(resp) {

    		if (resp && resp.length > 0	&& pageNumber < pageLimit)
    		{
		    	processCallback(resp); 
		    	fetch(api, pageNumber + 1, processCallback, finishedCallback);

			}
			else
			{
		    	finishedCallback();
			}

		});
    }
 
    myConnector.getData = function (table, doneCallback) {
    	var tableData = [];

    	if (table.tableInfo.id == "characterData") {
			fetch("characters",
				1, 
				function(resp) {
					processCharacterData(tableData, resp);
				}, 
				function() {
				    table.appendRows(tableData);
				    doneCallback();
				}); 
		} else if (table.tableInfo.id == "houseData") {
			fetch("houses",
				1, 
				function(resp) {
					processHouseData(tableData, resp);
				}, 
				function() {
				    table.appendRows(tableData);
				    doneCallback();
				}); 
		} else {
			fetch("books",
				1, 
				function(resp) {
					processBookData(tableData, resp);
				}, 
				function() {
				    table.appendRows(tableData);
				    doneCallback();
				}); 
		}
    };
 
    tableau.registerConnector(myConnector);

    $(document).ready(function () {
	    $("#submitButton").click(function () {
	        tableau.connectionName = "A Song of Ice and Fire Universe";
	        tableau.submit();
	    });
	});
})();