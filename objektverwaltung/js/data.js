// Test-Daten
// sessionStorage.nextId = 1;
// sessionStorage.objectList = '[{"id":1,"name":"Test-Objekt","description":"Test-Beschreibung","type":"Schreibtisch","relations":[]}]';

var objects = [];
var nextId = 1;

var types = ["Schreibtisch", "Computer", "Tastatur", "Server", "Mensch"];

function loaddata() {
	if (sessionStorage && sessionStorage.objectList) {
		objects = JSON.parse(sessionStorage.objectList);
		nextId = parseInt(sessionStorage.nextId);
	}
}

function savedata() {
	if (sessionStorage) {
		sessionStorage.objectList = JSON.stringify(objects);
		sessionStorage.nextId = nextId;
	}
}

function gettypeid(name) {
	return types.indexOf(name);
}

function gettypename(id) {
	return types[id];
}

function gettypes() {
	return types;
}

function getobjectlist(type, search) {
	var list = objects;
	if (type || search) {
		if (search) search = search.toLowerCase();
		list = [];
		for (var i = 0; i < objects.length; i++) {
			if (type && objects[i].type != type) {
				continue;
			}
			if (search && objects[i].name.toLowerCase().indexOf(search) == -1 && objects[i].description.toLowerCase().indexOf(search) == -1) {
				continue;
			}
			
			list.push(objects[i]);
		}
	}

	return list;
}

function getobjectbyid(id) {
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].id == id) {
			return objects[i];
		}
	}
}

function createobject(name, description, type) {
	var obj = new object(nextId, name, description, type, []);
	objects.push(obj);
	nextId++;
	return obj.id;
}

function deleteobject(id) {
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].id == id) {
			objects.splice(i, 1);
		}
		else if (objects[i].relations.indexOf(id) >= 0) {
			// entferne Relation
			objects[i].relations.splice(objects[i].relations.indexOf(id), 1);
		}
	}
}

function addrelation(object, idrelation) {
	if (object.relations.indexOf(idrelation) == -1) {
		object.relations.push(idrelation);
	}
}

function removerelation(object, idrelation) {
	if (object.relations.indexOf(idrelation) >= 0) {
		object.relations.splice(object.relations.indexOf(idrelation), 1);
	}
}

class object {

	constructor (id, name, description, type, relations) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.type = type;
		this.relations = relations;
	}

}