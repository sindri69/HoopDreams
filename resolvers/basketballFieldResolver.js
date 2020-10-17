module.exports = {
    queries: {
        allBasketballFields: (parent, args, context) => {
            const { basketballFieldService } = context.services;
            const { status } = args;
            return basketballFieldService.getAllBasketballfields(status, context);
    },
        basketballField: (parent, args, context) => {
            const { basketballFieldService } = context.services;
            const { id } = args;
            return basketballFieldService.getBasketballfieldById(id, context);
    },
},
}
