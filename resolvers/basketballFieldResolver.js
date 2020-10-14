module.exports = {
    queries: {
        allBasketballFields: (parent, args, context) => {
            const { basketballFieldService } = context.services;
            const { status } = args;
            return basketballFieldService.getAllBasketballfields();
    },
    basketballField: (parent, args, context) => {
        const { basketballService } = context;
        const { id } = args;
        return basketballService.getBasketballfieldById(id);
    }
}
}
