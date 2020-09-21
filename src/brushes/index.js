import RegularBrush from './RegularBrush';
import AllConnectionsBrush from './AllConnectionsBrush';
import NeightbourBrush from './NeightbourBrush';
import ThickBrush from './ThickBrush';

const brushes = [
	{
		key: 'normal',
		iconClassname: 'pencil',
		Create: RegularBrush,
	},
	{
		key: 'allconnections',
		iconClassname: 'pen',
		Create: AllConnectionsBrush,
	},
	{
		key: 'neighbor',
		iconClassname: 'quill',
		Create: NeightbourBrush,
	}
];

function createBrush(indexOfBrush = 0, ctx, theme) {
	if (!brushes[indexOfBrush]) {
		indexOfBrush = 0
	}
	return new brushes[indexOfBrush].Create({ ctx, theme });
}

export { brushes, createBrush };
