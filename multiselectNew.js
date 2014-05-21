//////////////////////////////////////////////
// Author: Marcelle Bonterre
// Created On: 5/20/2014
// Purpose: This allows for the creation
//          of HTML lists where multiple 
//          items in the list are selectable.
//////////////////////////////////////////////
function multiSelectHandler(){
	return {
		set_click_events: function(config){
			var elems = config.HTMLelements,
				callback = config.callback;

			if( ! window.multiselect ) window.multiselect = {};
			if( ! window.multiselect.columns ) window.multiselect.columns = {};

			var give_focus = function(e){ this.focus(); };

			var add_remove_selected = function(event){
				var parentID = this.parentNode.parentNode.id,
				val = this.value;

				if( ! multiselect.columns[parentID] ){
					multiselect.columns[parentID] = { selected : {} };
				}

				var selections = multiselect.columns[parentID].selected;
				if( this.checked ) selections[val] = this.id;
				else delete selections[val];
				
				if( callback ) callback( selections );
			};

			if( 'object' === typeof elems ){
				var numElems = elems.length;
				for( var k = 0; k < numElems; ++k ){
					elems[k].onclick = add_remove_selected;
					elems[k].onmouseover = give_focus;
				}
			} else {
				elems.onclick = add_remove_selected;
				elems.onmouseover = give_focus;
			}
		},
		get_selections_from: function(column){
			var rv = multiselect.columns[column];
			if( rv ) return rv.selected;
			return rv;
		},
		make_option: function(name,value,labelText,classNames){
			var input = document.createElement('input');
			input.type = 'checkbox';
			input.name = name;
			input.value = value;
			input.id = value+'option';
			input.style.float = 'left';

			var label = document.createElement('div');
			label.innerHTML = labelText;
			label.style.float = 'left';

			var container = document.createElement('div');
			// FIXME: feature detect classList.
			// if not present, use:
			// if(classNames) container.className += ' ' + classNames;
			if(classNames) container.classList.add(classNames);
			container.appendChild(input);
			container.appendChild(label);

			return container;
		},
		select: function(amt,column){
			var col = multiselect.columns[column];
			if('none' === amt){
				if( col ){
					var selections = col.selected;
					for( var key in selections ){
						var id = selections[key];
						document.getElementById(id).checked = false;
						delete selections[key];
					}
				}
			} else if( 'all' === amt ){

			} else {
				if( ! col ) col = multiselect.columns[column] = { selected : {} };
				var selections = col.selected,
					item = amt,
					id = item+'option';
				selections[item] = id;
				document.getElementById(id).checked = true;
			}
		},
		empty: function(column){
			var elem = document.getElementById(column);
			while (elem.firstChild) {
			  elem.removeChild(elem.firstChild);
			}
		},
		convert_select_to_checkbox: function(elem,callback){
			var div = document.createElement('div');
			div.id = 'tmp'+elem.id;
			div.style.overflow = 'scroll';

			var optStrings_from_optElems = function(optElemList){
				var optStrings = {},
				numOpts = optElemList.length;
				for(var i = 0; i < numOpts; ++i){
					var value = optElemList[i].value;
					var text = optElemList[i].innerHTML;

					optStrings[value] = text;
				}
				return optStrings;
			}

			var opts = optStrings_from_optElems(elem.options);
			for(var key in opts){
				var opt = this.make_option(elem.id+'opt',key,opts[key],'stripe');
				div.appendChild(opt);
			}

			var parent = elem.parentNode;
			parent.appendChild(div);
			parent.removeChild(elem);
			var replacement = document.getElementById(div.id);
			replacement.id = replacement.id.replace(/tmp/,'');

			if( callback ) callback( document.getElementById(div.id) );
			return document.getElementById(div.id);
		}

	}; // end return
} // end multiSelectHandler()
