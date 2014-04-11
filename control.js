attach_multiselect_detection_events();

// FIXME: change signiture to accept opts/selects as params
function attach_multiselect_detection_events(elems){
	window.formSelects = {};

	var opts = document.getElementsByTagName('option');
	var selects = document.getElementsByTagName('select');


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

	var add_remove_selected = function(){
		var child = this;
		var parentID = this.parentNode.id;
		var val = child.value;

		if( !formSelects[parentID]){
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
		test_events();
	};

	var exists = function(item,dataset){
		return (dataset[item] ? true : false );
	};

	for(var i = 0, numOpts = opts.length; i < numOpts; ++i){
		opts[i].onclick = add_remove_selected;
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