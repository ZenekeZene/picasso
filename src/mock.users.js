function launch() {
	let users = db.collection('user');
	
	users.add({
		name: 'Héctor Villar Mozo',
		email: 'hectorvillarm@gmail.com',
	});

	users.add({
		name: 'Jorge Fuente Lasala',
		email: 'jorgefuentelasala@outlook.es',
	});

	users.add({
		name: 'Maria Visitación Mozo',
		email: 'marivimozo@gmail.es',
	});

	users.add({
		name: 'Tokyo',
		email: 'ursulacorbero@gmail.com',
	});

	users.add({
		name: 'Beijing LA',
		email: 'emailfalso123@yahoo.es',
	});
}

export const mock = {
	launch,
};
