function get_tse_parameters()
{
    var param_str = window.location.search.substr(1);	// The first character is '?'
    url_params = param_str != null && param_str != "" ? extract_params_from_string( param_str ) : {};
	url_params.i = extract_intervals_from_string( url_params.i );
	return url_params;
}

function extract_params_from_string( param_str, group_delimiter = '&', key_value_pair_delimiter = '=' )
{
    var params = {};
    var params_list = param_str.split( group_delimiter );
    for ( var i = 0; i < params_list.length; i++ )
    {
        var key_value_pair = params_list[i].split( key_value_pair_delimiter );
        params[ key_value_pair[0] ] = key_value_pair[1];
    }
    return params;
}

function extract_intervals_from_string( intervals_str, group_delimiter = ';', pair_separator = ',' )
{
	var intervals = [];
    var intervals_list = intervals_str.split( group_delimiter );
    for ( var i = 0; i < intervals_list.length; i++ )
    {
        var pair = intervals_list[i].split( pair_separator );
        intervals.push( { begin: parseFloat( pair[0] ), end: parseFloat( pair[1] ) } );
    }
    return intervals;
	
}