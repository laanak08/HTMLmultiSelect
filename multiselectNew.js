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
					multiselect.columns[parentID] = { selected : {}, contents: {} };
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
		make_option: function(name,value,labelText,classNames,callback){
			var input = document.createElement('input');
			input.type = 'checkbox';
			input.name = name;
			input.value = value;
			input.id = value+'option';
			input.style.float = 'left';
			
			var container = document.createElement('div');
            // FIXME: feature detect classList.
            // if not present, use:
            // if(classNames) container.className += ' ' + classNames;
            if(classNames) container.classList.add(classNames);
            container.appendChild(input);
            container.appendChild(document.createTextNode(labelText));

            var optionObj = {
            	name: name,
            	value: value,
            	label: labelText,
            	id: value+'option',
            	HTML: container
            };

            if( callback ) callback(optionObj);
            return optionObj.HTML;
			// return container;
		},
		append: function(option,column){
			var key = option.value || option;
			if( ! 'object' === typeof column ) column = document.getElementById(column);
			if( ! multiselect.columns[column.id] ) {
				multiselect.columns[column.id] = { selected : {}, contents: {} };
			}

			if( ! multiselect.columns[column.id].contents[key] ){
				multiselect.columns[column.id].contents[key] = option;
				column.appendChild(option.HTML);
			}
		},
		empty: function(column){
			var col = multiselect.columns[column];
			if( col ) delete multiselect.columns[column];

			var elem = document.getElementById(column);
			while (elem.firstChild) {
				elem.removeChild(elem.firstChild);
			}
		},
		select: function(amt,column){
			var col = multiselect.columns[column];
			var selections, id;
			if('none' === amt){
				if( col ){
					selections = col.selected;
					for( var key in selections ){
						id = selections[key];
						document.getElementById(id).checked = false;
						delete selections[key];
					}
				}
			} else if( 'all' === amt ){

			} else {
				if( ! col ) col = multiselect.columns[column] = { selected : {}, contents: {} };
				selections = col.selected;
				var item = amt;
				id = item+'option';
				selections[item] = id;
				document.getElementById(id).checked = true;
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
			};

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
