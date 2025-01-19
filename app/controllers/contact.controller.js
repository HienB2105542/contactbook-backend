const ApiError = require("../api-error");

exports.create = async(req, res, next) => {
    if(!req.body.name) {
        return next(new ApiError(400, 'Name can not be required'));
    }

    try{
        const ContactService = new ContactService(MongoDB.client);
        const document = await ContactService.create(req.body);
        return res.send(document);
    }catch(err){
        new ApiError(500, "An error occurred while creating contact");
    };
};

exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const ContactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if(name){
            document = await ContactService.findByName(name);
        }else{
            document = await ContactService.findAll({});
        }
    }catch(error){
        new ApiError(500, "An error occurred while retrieving contacts");
    }
    return res.send(document);
};

exports.findOne = async(req, res, next) => {
    try {
        const ContactService = new ContactService(MongoDB.client);
        const document = await ContactService.findOne(req.params.id);
        if(!document){
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id = ${req.params.id} ` 
            )
        );
    }
};

exports.update = async(req, res, next) => {
    if (Object.keys(req.body).length === 0){
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send({message: 'Contact was updated successfully'});
    }catch(error){
        return next(
            new ApiError(
                500,
                `Error updating contact with id = ${req.params.id}`
            )
        );
    }
};

exports.delete = async(req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send({message: 'Contact was deleted successfully'});
    }catch(error){
        return next(
            new ApiError(
                500,
                `Error deleting contact with id = ${req.params.id}`
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deleteCount = await contactService.deleteAll();
        return res.send({
            message: `${deleteCount} contacts were deleted successfully`
        });
    }catch(error){
        return next(
            new ApiError(
                500,
                `An error occurred while removing all contacts`
            )
        );
    }
};

exports.findAllFavorite = async(req, res, next) => {  
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findAllFavorite();
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(
                500,
                `An error occurred while retrieving favorite contacts`
            )
        );
    }
};

