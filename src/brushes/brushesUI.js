const brushesUI = [
	{
		key: 'normal',
		iconClassname: 'pencil',
		type: 'simple',
	},
	{
		key: 'neighbor',
		iconClassname: 'pen',
		type: 'neighbor',
		config: {
			numNeighbors: 5,
		},
	},
	{
		key: 'spray',
		iconClassname: 'sprayer',
		type: 'neighbor',
		config: {
			numNeighbors: 20,
		},
	},
	{
		key: 'format',
		iconClassname: 'paint-format',
		type: '',
	},
	{
		key: 'quill',
		iconClassname: 'quill',
		type: '',
	},
];

export default brushesUI;
