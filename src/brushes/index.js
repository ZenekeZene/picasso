import RegularBrush from './RegularBrush';
import NeighbourBrush from './NeighbourBrush';

const brushes = [
	{
		key: 'normal',
		iconClassname: 'pencil',
		Create: RegularBrush,
	},
	{
		key: 'neighbor',
		iconClassname: 'pen',
		Create: NeighbourBrush,
		config: {
			numNeighbors: 5,
		},
	},
];

function createBrush(indexOfBrush, ctx, theme) {
	return new brushes[indexOfBrush].Create({ ctx, theme });
}

export { brushes, createBrush };
