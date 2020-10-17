const { ApolloError, UserInputError } = require('apollo-server');

class PickupGameExceedMaximumError extends ApolloError {
    constructor(message = 'Pickup game has exceeded the maximum of players.') {
        super(message, null, null);
        this.name = 'PickupGameExceedMaximumError';
        this.code = 409;
    }
};

class BasketballFieldClosedError extends ApolloError {
    constructor(message = 'Cannot add a pickup game to a closed basketball field') {
        super(message, null, null);
        this.name = 'BasketballFieldClosedError';
        this.code = 400;
    }
};

class PickupGameOverlapError extends ApolloError {
    constructor(message = 'Pickup games cannot overlap') {
        super(message, null, null);
        this.name = 'PickupGameOverlapError';
        this.code = 400;
    }
};

class PickupGameAlreadyPassedError extends ApolloError {
    constructor(message = 'Pickup game has already passed') {
        super(message, null, null);
        this.name = 'PickupGameAlreadyPassedError';
        this.code = 400;
    }
}

class NotFoundError extends ApolloError {
    constructor(message = 'Id was not found') {
        super(message, null, null);
        this.name = 'NotFoundError';
        this.code = 404;
    }
}

class PickupGameLengthError extends ApolloError {
    constructor(message = 'The game is too long or too short.'){
        super(message, null, null);
        this.name = "PickupGameLengthError";
        this.code = 400;
    }
}


class PickupGameDateError extends ApolloError {
    constructor(message = 'There is something wrong with the start and end dates'){
        super(message, null, null);
        this.name = "PickupGameDateError";
        this.code = 400;
    }
}


class DeletePickupGameError extends ApolloError {
    constructor(message = 'The game could not be deleted'){
        super(message, null, null);
        this.name = "PickupGameDeleteError";
        this.code = 400;
    }
}


class PlayerConflictError extends ApolloError {
    constructor(message = 'The player is busy'){
        super(message, null, null);
        this.name = "PlayerConflictError";
        this.code = 409;
    }
}

class RemovePlayerFromGameError extends ApolloError {
    constructor(message = 'The player could not be removed from the game'){
        super(message, null, null);
        this.name = "RemovePlayerFromGameError";
        this.code = 400;
    }
}

module.exports = {
    PickupGameExceedMaximumError,
    BasketballFieldClosedError,
    PickupGameOverlapError,
    PickupGameAlreadyPassedError,
    NotFoundError,
    UserInputError,
    PickupGameLengthError,
    PickupGameDateError,
    DeletePickupGameError,
    PlayerConflictError,
    RemovePlayerFromGameError

};
