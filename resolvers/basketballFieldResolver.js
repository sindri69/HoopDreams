module.exports = {
    queries: {
        allBasketballFields: (parent, args, context) => {
            console.log(parent)
            const { basketballService } = context;
            const { status } = args;
            console.log(basketballService)
            return basketballService.getAllBasketballfields();
    },
    basketballField: (parent, args, context) => {
        const { basketballService } = context;
        const { id } = args;
        return basketballService.getBasketballfieldById(id);
    }
}
}