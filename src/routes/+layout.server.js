export function load({ locals }) {
	if (locals.user) {
		const userPicture = locals.user.picture;
		const username = locals.user.name;
		const customerLastMessageFrom = locals.user.lastMessageFrom;
		const admin = locals.user.admin;
		return { userPicture, username, admin, customerLastMessageFrom };
	}
}
