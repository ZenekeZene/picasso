import { RegularBrush, NeighbourBrush } from './Brushes';

const brushesUI = [
	{
		key: 'normal',
		iconClassname: 'pencil',
		ref: RegularBrush,
	},
	{
		key: 'neighbor',
		iconClassname: 'pen',
		ref: NeighbourBrush,
		config: {
			numNeighbors: 5,
		},
	},
];

export default brushesUI;
