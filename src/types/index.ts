export type UserType = {
	_id: string;
	firstName: string;
	email: string;
	profilePic: string;
};

export type MessageType = {
	_id: string;
	senderId: string;
	receiverId: string;
	message: string;
	image?: string;
	createdAt: Date;
};

export interface CookieValues {
	token?: string;
}
