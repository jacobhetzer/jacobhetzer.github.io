var typeFilter = null;
var searchWord = "";
var objectEditing = null;

function init() {
	loaddata();
	filltypes();
	gototypeselection();
}

function togglesearch() {
	var el = document.getElementById('searchbox');
	if (el.style.display == 'none') {
		el.style.display = 'inline';
		el.focus();
	}
	else {
		el.style.display = 'none';
	}
}
function hidesearch() {
	var el = document.getElementById('searchbox');
	el.style.display = 'none';
	el.value = '';
}

function setTitle(title) {
	document.getElementById('information').innerHTML = title;
}

function loadobjectlist () {
	var objs = getobjectlist(typeFilter, searchWord);
	var list = document.getElementById('listcontent');

	// Liste leeren
	list.innerHTML = '';

	for (var i = 0; i < objs.length; i++) {
		// Zeile (Flex)
		var row = document.createElement("div");

		// Spalten
		var id = document.createElement('div');
		id.className = "idcol";
		id.innerText = objs[i].id;
		row.appendChild(id);
		var name = document.createElement('div');
		name.className = "namecol";
		name.innerHTML = '<a href="" onclick="editobj(' + objs[i].id + '); return false">' + objs[i].name + '</a>';
		row.appendChild(name);
		var type = document.createElement('div');
		type.className = "typecol";
		type.innerText = objs[i].type;
		row.appendChild(type);
		var tools = document.createElement('div');
		tools.className = "toolscol";
		// sollte besser im HTML
		tools.innerHTML = '<a href="" onclick="delobj(' + objs[i].id + '); return false"><img src="icons/delete.png" alt="X" /></a>';
		row.appendChild(tools);

		list.appendChild(row);
	}
}

function loadrelationlist() {
	var list = document.getElementById('relationlist');
	list.innerHTML = '';

	if (objectEditing) {
		var rels = objectEditing.relations;
		
		for (var i = 0; i < rels.length; i++) {
			var obj = getobjectbyid(rels[i]);
			var row = document.createElement('div');

			var namecol = document.createElement('div');
			namecol.innerHTML = obj.name;
			namecol.className = 'namecol';
			row.appendChild(namecol);

			var toolscol = document.createElement('div');
			toolscol.innerHTML = '<a href="" onclick="relationdel(\'' + rels[i] + '\'); return false"><img src="icons/delete.png" alt="X" /></a>';
			toolscol.className = 'toolscol';
			row.appendChild(toolscol);

			list.appendChild(row);
		}
	}
}

function loadrelationaddlist() {
	var objs = getobjectlist();

	var sel = document.getElementById('addrelation');
	sel.innerHTML = '';

	var emptyOption = document.createElement('option');
	emptyOption.text = 'Relation erstellen...';
	sel.appendChild(emptyOption);

	for (var i = 0; i < objs.length; i++) {
		if (objs[i].id != objectEditing.id) {
			var opt = document.createElement('option');
			opt.value = objs[i].id;
			opt.text = objs[i].name;
			sel.appendChild(opt);
		}
	}
}

function filltypes() {
	var types = gettypes();
	var select = document.getElementById('typeInput');
	for (var i = 0; i < types.length; i++) {
		var opt = document.createElement('option');
		opt.value = types[i];
		opt.text = types[i];
		select.appendChild(opt);
	}
}

function gototypeselection() {
	objectEditing = null;
	searchWord = null;
	setTitle('Objektverwaltung');
	hidesearch();
	document.getElementById('objectlist').style.display = 'none';
	document.getElementById('typeselection').style.display = 'block';
	document.getElementById('objectedit').style.display = 'none';
}

function gotoobjectlist(typefilter) {
	typeFilter = typefilter;
	objectEditing = null;
	searchWord = null;
	loadobjectlist();

	hidesearch();
	showobjectlist();
}

function showobjectlist () {
	document.getElementById('objectlist').style.display = 'block';
	document.getElementById('typeselection').style.display = 'none';
	document.getElementById('objectedit').style.display = 'none';

	setTitle('Objekt-Liste' + (typeFilter ? ' (' + typeFilter + ')' : ''));
}

function showedit() {
	hidesearch();
	document.getElementById('objectlist').style.display = 'none';
	document.getElementById('typeselection').style.display = 'none';
	document.getElementById('objectedit').style.display = 'block';

	if (objectEditing) {
		document.getElementById('editrelations').style.display = 'block';
	}
	else {
		document.getElementById('editrelations').style.display = 'none';
	}
}

function editobj(id) {
	var name = '';
	var desc = '';
	var type = '';

	if (id) {
		objectEditing = getobjectbyid(id);
		setTitle(objectEditing.name);
		name = objectEditing.name;
		desc = objectEditing.description;
		type = objectEditing.type;

		loadrelationaddlist();
		loadrelationlist();
	}

	document.getElementById('nameInput').value = name;
	document.getElementById('descInput').value = desc;
	document.getElementById('typeInput').selectedIndex = gettypeid(type);

	showedit();
}

function editsave() {
	var keepEditing = false;
	var newId = null;

	var name = document.getElementById('nameInput').value;
	var desc = document.getElementById('descInput').value;
	var type = gettypename(document.getElementById('typeInput').selectedIndex);

	if (!objectEditing) {
		newId = createobject(name, desc, type);
		// weiter im Bearbeiten Bildschirm bleiben, um Relationen bearbeiten zu können
		keepEditing = true;
	}
	else {
		objectEditing.name = name;
		objectEditing.description = desc;
		objectEditing.type = type;
	}

	savedata();

	if (keepEditing) {
		editobj(newId);
	}
	else {
		editend();
	}
}

function editend() {
	objectEditing = null;
	loadobjectlist();
	showobjectlist();
}

function delobj(id) {
	// frage Benutzer, ob Objekt gelöscht werden soll
	if (confirm('Objekt mit ID ' + id + ' wirklich löschen?')) {
		deleteobject(id);
		savedata();
		loadobjectlist();
	}
}

function relationadd() {
	var relid = document.getElementById('addrelation').selectedOptions[0].value;
	addrelation(objectEditing, relid);
	savedata();
	loadrelationlist();
	document.getElementById('addrelation').selectedIndex = 0;
}
function relationdel(relid) {
	removerelation(objectEditing, relid);
	savedata();
	loadrelationlist();
}

function dosearch() {
	var search = document.getElementById('searchbox');
	typeFilter = null;
	searchWord = search.value;
	loadobjectlist();
	showobjectlist();
}