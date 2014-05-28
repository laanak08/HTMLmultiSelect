		get_selections_from: function(column){
			var rv;
			(multiselect.columns[column]) ? rv = multiselect.columns[column].selected : rv =  multiselect.columns[column];
			return rv;
		},
		get_contents: function(column){
			var rv;
			(multiselect.columns[column]) ? rv = multiselect.columns[column].contents : rv =  multiselect.columns[column];
			return rv;			
		},	
