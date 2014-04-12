HTMLmultiSelect
===============

Javascript implementation of a quick multiselect handler for HTML &lt;select&gt;  and &lt;option&gt;

Problem:
        Given a significantly long list of &lt;option&gt; tags within a &lt;select&gt;, and the need to select multiple options,
it quickly becomes necessary to loop through the entire list of options to discover which option tag is selected.

Solution:
		My bit of javascript makes the process of keeping track of selected options in a multiselect situation much faster by eliminating the
constant need for interating throughout the list of options. My solution is to attach various mouse events to each option and have them update a global data structure with their selections.
