const notificationSound = new Audio('/sounds/notification.mp3');

const useNotificationSound = () => {
	notificationSound.currentTime = 0;
	notificationSound.play().catch((err) => console.log(err));
};

export default useNotificationSound;
