export default {
	inserted: (el, binding) => {
		el.addEventListener('touchstart', (event) => {
			if (!el.parentNode.classList.contains('--disabled')) {
				el.style.color = binding.arg;
				if (binding.expression) {
					el.classList.add(binding.expression.replace(/'/g, ''));
				}
				setTimeout(() => {
					event.target.style.color = 'unset';
					if (binding.expression) {
						el.classList.remove(
							binding.expression.replace(/'/g, '')
						);
					}
				}, 250);
			}
		});
	},
};

