function attach_multiselect_detection_events(optionElems,selectElems,callback){
	window.formSelects = {};

	var opts = optionElems || document.getElementsByTagName('option');
	var selects = selectElems || document.getElementsByTagName('select');

	var give_focus = function(){ this.focus(); };

	var handle_ctrl_keypress = function(event){
		var ctrlKeyCode = 17;
		if( event.keyCode === ctrlKeyCode){
			if( event.type === 'keydown'){
				formSelects.ctrlKey = true;
			}else if( event.type === 'keyup'){
				formSelects.ctrlKey = false;
			}
		}
	};

	var exists = function(item,dataset){
		return ( dataset[item] ? true : false );
	};

	var add_remove_selected = function(event){
		var	adjacentSelected = [],
			i = startIndex,
			j = startIndex;

		var child = this,
			parentID = this.parentNode.id,
			val = child.value;

		var select = document.getElementById(parentID);
		var optIndex = select.selectedIndex;

		if(event.type === 'click'){ 
			handle_click(); 
		}else{
			var adjacent_selected = discover_adjacent_selected();
		}
		callback();

		var handle_click = function(){
			if( !formSelects[parentID] ){
				formSelects[parentID] = { selected : {} };
				formSelects[parentID].selected[val] = 1;
			} else {
				if( formSelects.ctrlKey === true ){
					if( exists(val,formSelects[parentID].selected) ){
						delete formSelects[parentID].selected[val];
					}else{
						formSelects[parentID].selected[val] = 1;
					}
				} else if( !formSelects.ctrlKey || formSelects.ctrlKey === false ){
					delete formSelects[parentID];
					formSelects[parentID] = { selected : {} };
					formSelects[parentID].selected[val] = 1;
				}
			}
		};

		var discover_adjacent_selected = function(){
			// FIXME: save and return indices of selected elements in addition to values
			while( selectElem.options[i].selected){
				adjacentSelected.push(selectElem.options[i].value);
				++i;
			}

			while(selectElem.options[j].selected){
				adjacentSelected.push(selectElem.options[i].value);
				--j;
			}
			return adjacentSelected;
		};
	};

	for(var i = 0, numOpts = opts.length; i < numOpts; ++i){
		opts[i].onclick = add_remove_selected;
		opts[i].onmouseup = add_remove_selected;
	}

	for(var j = 0, numSelects = selects.length; j < numSelects; ++j){
		selects[j].onmouseover = give_focus;
		selects[j].onkeydown = handle_ctrl_keypress;
		selects[j].onkeyup = handle_ctrl_keypress;
	}
}

function test_events(){
	var parents = Object.keys(formSelects);
	for(var i = 0, numParents = parents.length; i < numParents; ++i){
		if(parents[i] !== 'ctrlKey'){
			console.log( parents[i] + " " + JSON.stringify( formSelects[parents[i]].selected,null,'\t' ) );
		}
	}
}

var allOpts =  document.getElementsByTagName('option');
var allSelects = document.getElementsByTagName('select');

attach_multiselect_detection_events(allOpts,allSelects,test_events);