const baseURL = 'http://localhost:8000/';

const apiConfig = {
    baseURL: baseURL,
    playerRegistrationsRoute: baseURL + 'player-registrations',
    gameNightsRoute: baseURL + 'game-nights',
    usersRoute: baseURL + 'users',
    gameInstancesRoute: baseURL + 'game-instances',
};

export default apiConfig;